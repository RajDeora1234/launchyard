import axios from "axios";
import "./app.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [gitUrl, setGitUrl] = useState("");
  const [projectName, setProjectName] = useState("");


const handleDeploy = async () => {
  if (!gitUrl || !projectName) {
    toast.error("❌ Please provide both Git URL and Project Name.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:9000/project", {
      gitURL: gitUrl,
      slug: projectName,
    });

    toast.success(`🚀 Project "${response.data.data.projectSlug}" deployed successfully!`);
    console.log("API response:", response.data);
    setGitUrl("")
    setProjectName("")
  } catch (error) {
    console.error("Deployment failed:", error);
    toast.error("❌ Deployment failed. Please try again.");
    setGitUrl("")
    setProjectName("")
  }
};


  return (
    <div className="main-div">
      <div className="form-container">

        <h2>🚀 Deploy Your Project</h2>

        <div className="input-group">
          <label>Git Repository URL</label>
          <input
            type="text"
            placeholder="https://github.com/user/repo.git"
            value={gitUrl}
            onChange={(e) => setGitUrl(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Project Name</label>
          <input
            type="text"
            placeholder="my-awesome-project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>

        <button className="deploy-btn" onClick={handleDeploy}>
          Deploy
        </button>
      </div>
       <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;