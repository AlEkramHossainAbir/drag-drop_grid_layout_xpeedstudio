import React from "react";
const TextArea = ({ values }) => {
    
  let text = JSON.stringify(values, null, '\t')
  return (
    <div>
      <textarea value={text} className="text_area"/>
    </div>
  );
};

export default TextArea