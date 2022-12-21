import { useRef, useState } from "react";
import Tesseract from "tesseract.js";
import "./App.css";

function App() {
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const handleChange = (event) => {
    setImagePath(URL.createObjectURL(event.target.files[0]));
  };

  const handleClick = async () => {
    const { createWorker } = require("tesseract.js");

    const worker = await createWorker({
      logger: (m) => console.log(m), // Add logger here
    });

    (async () => {
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const {
        data: { text },
      } = await worker.recognize(imagePath);
      console.log(text);
      setText(text);
      await worker.terminate();
    })();
  };

  return (
    <div className="App">
      <main className="App-main">
        <h3>Actual image uploaded</h3>
        <img src={imagePath} className="App-logo" alt="logo" />
        <h3>Extracted text</h3>
        <div className="pin-box">
          <p> OCR text: {text} </p>
        </div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleClick} style={{ height: 50 }}>
          {" "}
          convert to text
        </button>
      </main>
    </div>
  );
}

export default App;
