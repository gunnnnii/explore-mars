import {
  property,
  subclass,
} from "@arcgis/core/core/accessorSupport/decorators";
import Widget from "@arcgis/core/widgets/Widget";
import { tsx } from "@arcgis/core/widgets/support/widget";
import { match } from "ts-pattern";
import { AddObjectPage } from "./AddObject";
import { AddRegionPage } from "./AddRegion";
import { watch } from "@arcgis/core/core/reactiveUtils";
import { Item, SubMenu } from "../utility-components/SubMenu";
import styles from "./ComparePage.module.scss";
import { CloseButton } from "../utility-components/CloseButton";

type Page = "menu" | "regions" | "models";

@subclass("ExploreMars.page.CompareObject")
export class ComparePage extends Widget {
  @property()
  page: Page = "menu";

  private addRegionWidget!: AddRegionPage;
  private addObjectWidget!: AddObjectPage;

  initialize() {
    const watchPageHandle = watch(
      () => this.page,
      (page) => {
        if (page === "menu") return;

        if (page === "regions") {
          this.addRegionWidget?.destroy();
          this.addRegionWidget = new AddRegionPage();
        }

        if (page === "models") {
          this.addObjectWidget?.destroy();
          this.addObjectWidget = new AddObjectPage();
        }
      },
    );
    this.addHandles(watchPageHandle);
  }

  render() {
    if (this.page === "menu")
      return (
        <CompareMenu
          selectTool={(tool) => {
            this.page = tool;
          }}
        />
      );

    const widget = match(this.page)
      .with("regions", () => this.addRegionWidget)
      .with("models", () => this.addObjectWidget)
      .exhaustive();

    return (
      <div class={styles.compareInfo}>
        <CloseButton
          onClose={() => {
            this.page = "menu";
          }}
        />
        {widget.render()}
      </div>
    );
  }

  destroy() {
    super.destroy();
  }
}

interface CompareMenuProps {
  selectTool: (tool: Exclude<Page, "menu">) => void;
}
function CompareMenu({ selectTool }: CompareMenuProps) {
  return (
    <SubMenu
      items={[
        <Item
          text="Regions"
          onClick={() => {
            selectTool("regions");
          }}
          itemClass={styles.regions}
        />,
        <Item
          text="Models"
          onClick={() => {
            selectTool("models");
          }}
          itemClass={styles.models}
        />,
      ]}
    />
  );
}

export function EditingInfo() {
  return (
    <p>
      Move the object in the view using the orange handles. Press "delete" to
      remove the object.
    </p>
  );
}
