"use client";
import "./create.css";

export default function Create() {
  return (
    <main id="create_drop_page">
      <div id="create_drop_container">
        <h1 id="create_drop_title">Create Drop</h1>
        <p id="create_drop_text">
          Upload a file to create a secure drop.
        </p>

        <form id="create_drop_form">
          <label htmlFor="file_upload" id="drop_zone">
            <p>Drag and drop a file here</p>
            <p>or</p>
            <span id="choose_file_text">Choose a file</span>
          </label>

          <input
            type="file"
            id="file_upload"
            name="file_upload"
            hidden
          />

          <button type="button" id="upload_button">
            Upload File
          </button>
        </form>
      </div>
    </main>
  );
}