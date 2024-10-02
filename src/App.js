// NOTE - Read Readme.md File

import React, { useState, useEffect, useRef } from 'react';

const CanvasTextEditor = () => {
  const canvasRef = useRef(null);
  const [texts, setTexts] = useState([]); // Store the text objects
  const [selectedIndex, setSelectedIndex] = useState(-1); // Keep track of the selected text
  const [newText, setNewText] = useState('New Text');
  const [fontSize, setFontSize] = useState(30);
  const [fontStyle, setFontStyle] = useState('Arial');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [dragOffsetY, setDragOffsetY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawAllTexts(ctx);
  }, [texts, fontSize, fontStyle]); // Re-render canvas when texts, font size, or font style change

  const drawAllTexts = (ctx) => {
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear the canvas
    texts.forEach((text, index) => {
      ctx.font = `${text.fontSize}px ${text.fontStyle}`;
      ctx.fillText(text.content, text.x, text.y);
    });
  };

  const addText = () => {
    const newTextObject = {
      content: newText,
      fontSize: fontSize,
      fontStyle: fontStyle,
      x: 50,
      y: 100,
    };
    setTexts([...texts, newTextObject]);
    setSelectedIndex(texts.length); // Select the newly added text
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    texts.forEach((text, index) => {
      const textWidth = canvasRef.current
        .getContext('2d')
        .measureText(text.content).width;
      const textHeight = text.fontSize;
      if (
        mouseX > text.x &&
        mouseX < text.x + textWidth &&
        mouseY > text.y - textHeight &&
        mouseY < text.y
      ) {
        setSelectedIndex(index);
        setIsDragging(true);
        setDragOffsetX(mouseX - text.x);
        setDragOffsetY(mouseY - text.y);
      }
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging && selectedIndex !== -1) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const updatedTexts = [...texts];
      updatedTexts[selectedIndex].x = mouseX - dragOffsetX;
      updatedTexts[selectedIndex].y = mouseY - dragOffsetY;
      setTexts(updatedTexts);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTextChange = (e) => {
    if (selectedIndex !== -1) {
      const updatedTexts = [...texts];
      updatedTexts[selectedIndex].content = e.target.value;
      setTexts(updatedTexts);
    }
    setNewText(e.target.value);
  };

  const handleFontSizeChange = (e) => {
    if (selectedIndex !== -1) {
      const updatedTexts = [...texts];
      updatedTexts[selectedIndex].fontSize = parseInt(e.target.value, 10);
      setTexts(updatedTexts);
    }
    setFontSize(e.target.value);
  };

  const handleFontStyleChange = (e) => {
    if (selectedIndex !== -1) {
      const updatedTexts = [...texts];
      updatedTexts[selectedIndex].fontStyle = e.target.value;
      setTexts(updatedTexts);
    }
    setFontStyle(e.target.value);
  };

  return (
    <div>
      <div>
        <label>Text: </label>
        <input
          type="text"
          value={newText}
          onChange={handleTextChange}
          placeholder="Enter text"
        />
        <label>Font Size: </label>
        <input
          type="number"
          value={fontSize}
          onChange={handleFontSizeChange}
          min="10"
          max="100"
        />
        <label>Font Style: </label>
        <select value={fontStyle} onChange={handleFontStyleChange}>
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>
        <button onClick={addText}>Add Text</button>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid black' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default CanvasTextEditor;
