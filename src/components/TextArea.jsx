import React from "react";
const TextArea = ({ layout }) => {
  let text = JSON.stringify(layout, null, "\t");
  return (
    <div>
      <textarea value={text} className="text_area" />
    </div>
  );
};

export default TextArea