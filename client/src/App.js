import { BrowserRouter, Routes, Route } from "react-router-dom";
import DataList from "./components/DataList";
import DetailDataList from "./components/DetailDataList";
import AddData from "./components/AddData";
import EditData from "./components/EditData";
import ChartData from "./components/ChartData";
import AddDetailData from "./components/AddDetailData";
import EditDetailData from "./components/EditDetailData";
import MainDataList from "./components/MainDataList";
import EditMainData from "./components/EditMainData";
import AddMainData from "./components/AddMainData";
import ChartDetailData from "./components/ChartDetailData";
import EditPengukuran from "./components/EditPengukuran";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ minWidth: "60vw" }}>
          <Routes>
            <Route path="/" element={<MainDataList />} />
            <Route path="addMainData" element={<AddMainData />} />
            <Route path="editMainData/:id" element={<EditMainData />} />
            <Route path="viewData/:id" element={<DataList />} />
            <Route path="viewData/:id/addData/:id" element={<AddData />} />
            <Route path="viewData/:id/editData/:id" element={<EditData />} />
            <Route path="viewData/:id/chartData/:id" element={<ChartData />} />
            <Route
              path="viewData/:id/viewDetailData/:id"
              element={<DetailDataList />}
            />
            <Route
              path="viewData/:id/viewDetailData/:id/addDetail/:id"
              element={<AddDetailData />}
            />
            <Route
              path="viewData/:id/viewDetailData/:id/editDetail/:id"
              element={<EditDetailData />}
            />
            <Route
              path="viewData/:id/viewDetailData/:id/chartDetail/:id"
              element={<ChartDetailData />}
            />
            <Route path="pengaturan" element={<EditPengukuran />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
