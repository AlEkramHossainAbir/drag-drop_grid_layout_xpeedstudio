import React, { useCallback, useState } from "react";

import DropZone from "./DropZone";
import {
  handleMoveSidebarComponentIntoParent,
  handleMoveToDifferentParent,
  handleMoveWithinParent,
  handleRemoveItemFromLayout,
} from "../lib/helpers";
import initialData from "../lib/initial-data";
import Row from "./Row";
import SideBarItem from "./SideBarItem";
import TrashDropZone from "./TrashDropZone";
import TextArea from "./TextArea";

import shortid from "shortid";
import {
  COLUMN,
  COMPONENT,
  SIDEBAR_ITEM,
  SIDEBAR_ITEMS,
} from "../lib/constants";

const Container = () => {
  const initialLayout = initialData.layout;
  const initialComponents = initialData.components;
  const [layout, setLayout] = useState(initialLayout);
  const [components, setComponents] = useState(initialComponents);
  const [rowIndex, setRowIndex] = useState(0);
  const [columnIndex, setColumnIndex] = useState(0);

  const handleDropToTrashBin = useCallback(
    (dropZone, item) => {
      const splitItemPath = item.path.split("-");
      setLayout(handleRemoveItemFromLayout(layout, splitItemPath));
    },
    [layout]
  );

  const handleDrop = useCallback(
    (dropZone, item) => {
      console.log("dropZone", dropZone);
      console.log("item", item);
      let path = dropZone.path;
      if (path.length > 1) {
        let pathIndex = path.slice(-1, path.length);
        setColumnIndex(pathIndex);
      } else {
        setRowIndex(path);
      }

      // alert(layout?.children?.id)

      const splitDropZonePath = dropZone.path.split("-");
      const pathToDropZone = splitDropZonePath.slice(0, -1).join("-");

      const newItem = { id: item.id, type: item.type };
      if (item.type === COLUMN) {
        newItem.children = item.children;
      }

      // sidebar into
      if (item.type === SIDEBAR_ITEM) {
        // 1. Move sidebar item into page
        if (item.component.type === "row" || item.component.type === "column") {
          const newComponent = {
            id: "1",
            ...item.component,
          };
          const newItem = {
            id: newComponent.id,
            type: COMPONENT,
          };
          setComponents({
            ...components,
            [newComponent.id]: newComponent,
          });
          setLayout(
            handleMoveSidebarComponentIntoParent(
              layout,
              splitDropZonePath,
              newItem
            )
          );
        } else {
          const newComponent = {
            id: shortid.generate(),
            ...item.component,
          };
          const newItem = {
            id: newComponent.id,
            type: COMPONENT,
          };
          setComponents({
            ...components,
            [newComponent.id]: newComponent,
          });
          setLayout(
            handleMoveSidebarComponentIntoParent(
              layout,
              splitDropZonePath,
              newItem
            )
          );
        }
        return;
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path.split("-");
      const pathToItem = splitItemPath.slice(0, -1).join("-");

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          setLayout(
            handleMoveWithinParent(layout, splitDropZonePath, splitItemPath)
          );
          return;
        }

        // 2.b. OR move different parent
        // TODO FIX columns. item includes children
        setLayout(
          handleMoveToDifferentParent(
            layout,
            splitDropZonePath,
            splitItemPath,
            newItem
          )
        );
        return;
      }

      // 3. Move + Create
      setLayout(
        handleMoveToDifferentParent(
          layout,
          splitDropZonePath,
          splitItemPath,
          newItem
        )
      );
    },
    [layout, components]
  );
  // if (layout.length > 0) {
  //   console.log(layout.length);
  //   console.log(layout[rowIndex].children[columnIndex].id);
  // }

  const renderRow = (row, currentPath) => {
    return (
      <Row
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        layout={layout}
        columnIndex={columnIndex}
        rowIndex={rowIndex}
        components={components}
        path={currentPath}
      />
    );
     
  };

  // dont use index for key when mapping over items
  // causes this issue - https://github.com/react-dnd/react-dnd/issues/342
  return (
    <div className="body">
      <div className="sideBar">
        {Object.values(SIDEBAR_ITEMS).map((sideBarItem, index) => (
          <SideBarItem key={sideBarItem.id} data={sideBarItem} />
        ))}
      </div>
      <div className="pageContainer">
        <div className="page">
          {layout.map((row, index) => {
            const currentPath = `${index}`;

            return (
              <React.Fragment key={row.id}>
                <DropZone
                  data={{
                    path: currentPath,
                    childrenCount: layout.length,
                  }}
                  onDrop={handleDrop}
                  path={currentPath}
                />
                {renderRow(row, currentPath)}
              </React.Fragment>
            );
          })}
          <DropZone
            data={{
              path: `${layout.length}`,
              childrenCount: layout.length,
            }}
            onDrop={handleDrop}
            isLast
          />
        </div>

        <TrashDropZone
          data={{
            layout,
          }}
          onDrop={handleDropToTrashBin}
        />
        <TextArea layout={layout} rowIndex={rowIndex} columnIndex={columnIndex} />
      </div>
    </div>
  );
};
export default Container;
