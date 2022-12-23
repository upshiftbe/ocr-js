import { useState } from "react";
import { createWorker } from "tesseract.js";
import styled from "styled-components";
import Container from "./components/Container";
import { Button, ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChange = (event) => {
    setImagePath(URL.createObjectURL(event.target.files[0]));
  };

  const clearImage = () => {
    setImagePath("");
    setText("");
    setProgress(0);
  };

  const handleClick = async () => {
    const worker = await createWorker({
      logger: (m) => {
        console.log(m);
        setProgress(parseInt(m?.progress * 100));
      }, // Add logger here
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
    <div>
      <main>
        <Container>
          <h1>Offline image OCR</h1>
          <h2>Upload file</h2>
          <input type="file" onChange={handleChange} />
          {imagePath && (
            <>
              <Steps>
                <ImageWrapper>
                  <>
                    <h3>Actual image uploaded</h3>
                    <UploadedImage src={imagePath} />
                    <Button
                      variant={"warning"}
                      onClick={clearImage}
                      style={{ height: 50 }}
                    >
                      clear
                    </Button>
                  </>
                </ImageWrapper>
                <CTAWrapper>
                  <Button onClick={handleClick} style={{ height: 50 }}>
                    convert to text
                  </Button>
                </CTAWrapper>
                <OutputWrapper>
                  <>
                    <h3>Extracted text</h3>
                    <p> {text}</p>
                  </>
                </OutputWrapper>
              </Steps>
              <ProgressBarWrapper>
                {progress === (0 || 100) ? (
                  <ProgressBar now={progress} label={`${progress}%`} />
                ) : (
                  <ProgressBar animated now={progress} label={`${progress}%`} />
                )}
              </ProgressBarWrapper>
            </>
          )}
        </Container>
      </main>
    </div>
  );
}

export default App;

const Steps = styled.div`
  display: flex;
  gap: 20px;
  margin: 100px 0;
`;

const UploadedImage = styled.img`
  max-width: 300px;
`;

const CTAWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const OutputWrapper = styled.div`
  max-width: 300px;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProgressBarWrapper = styled.div`
  margin: 50px 0;
`;
