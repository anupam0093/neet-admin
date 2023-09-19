// RichText.tsx in your components folder
import React from "react";
import dynamic from "next/dynamic";
const IRichTextEditor = dynamic(() => import("@mantine/rte"), {
  // Disable during server side rendering
  ssr: false,

  // Render anything as fallback on server, e.g. loader or html content without editor
  loading: () => null,
});

function RichTextEditor() {
  const [renderHtml, setRenderHtml] = React.useState("");
  return (
    <React.Fragment>
      <IRichTextEditor
        id="rte"
        sticky={false}
        value={renderHtml}
        onChange={(value, delta, sources) => setRenderHtml(value)}
        placeholder="Type Here"
        controls={[
          ["bold", "italic", "underline"],
          ["link", "image", "video", "blockquote", "code"],
          ["unorderedList", "h1", "h2", "h3"],
          ["alignLeft", "alignCenter", "alignRight"],
        ]}
      />
    </React.Fragment>
  );
}

export default RichTextEditor;
