import { observer } from "mobx-react-lite";
import Demo from "./Demo";

const VisualiseResults = observer(() => {
  return (
    <div style={{ width: "calc(100vw - 200)", height: "82vh" }}>
      {/* <div style={{ width: '100%', height: '100%'}}> */}
      <Demo />
    </div>
  );
});

export default VisualiseResults;
