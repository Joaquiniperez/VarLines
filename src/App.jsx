import React, { useState } from 'react';
import { Stage, Layer, Line, Rect, Image } from 'react-konva';

function App() {
    const [loadedImage, setLoadedImage] = useState(null);
  const [points, setPoints] = useState([]);
  const [curMousePos, setCurMousePos] = useState([0, 0]);
  const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(false);

  const getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const image = new window.Image();
        image.src = e.target.result;

        setLoadedImage(image);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleClick = (event) => {
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);

    if (points.length < 4) {
      setPoints([...points, mousePos]);
    }
  };

  const handleMouseMove = (event) => {
    const stage = event.target.getStage();
    const mousePos = getMousePos(stage);
    setCurMousePos(mousePos);
  };

  const handleMouseOverStartPoint = (event) => {
    setIsMouseOverStartPoint(true);
  };

  const handleMouseOutStartPoint = (event) => {
    setIsMouseOverStartPoint(false);
  };

  const handleDragStartPoint = (event) => {
    console.log('start', event);
  };

  const handleDragMovePoint = (event) => {
    const index = event.target.index;
    const pos = [event.target.attrs.x, event.target.attrs.y];
    setPoints((prevPoints) => {
      const newPoints = [...prevPoints];
      newPoints[index] = pos;
      return newPoints;
    });
  };

  return (
    <div>
      <p1>Añade tu imagen de la jugada de futbol para determinar la posicion de los jugadores!</p1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      <Stage width={window.innerWidth} height={window.innerHeight} onMouseDown={handleClick} onMouseMove={handleMouseMove}>
        <Layer>
          {loadedImage && (
            <Image image={loadedImage} x={0} y={0} width={window.innerWidth} height={window.innerHeight} />
          )}
          {points.length >= 2 && (
            <Line
              points={points.flatMap((point) => [point[0], point[1]])}
              stroke="black"
              strokeWidth={5}
              closed
            />
          )}
          {points.map((point, index) => {
            const width = 6;
            const x = point[0] - width / 2;
            const y = point[1] - width / 2;
            const startPointAttr = {
              hitStrokeWidth: 12,
              onMouseOver: handleMouseOverStartPoint,
              onMouseOut: handleMouseOutStartPoint,
            };
            return (
              <Rect
                key={index}
                x={x}
                y={y}
                width={width}
                height={width}
                fill="white"
                stroke="black"
                strokeWidth={3}
                onDragStart={handleDragStartPoint}
                onDragMove={handleDragMovePoint}
                draggable
                {...startPointAttr}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;