import React from "react";
const TextArea = ({ layout,rowIndex,columnIndex }) => {
  let text = JSON.stringify(layout, null, "\t");
  // console.log(layout.length);
  console.log(layout.rowIndex);
  return (
    <div>
      <textarea value={text} className="text_area" />
    </div>
  );
};

export default TextArea