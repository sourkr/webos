# WebOS

A lightweight, single-page web application that emulates a desktop operating system environment directly in the browser. It features a custom-built virtual machine that runs in a Web Worker, a micro-kernel architecture for managing processes, and a virtual filesystem.

## Architecture

The project uses a client-server model where the Node.js server has a minimal role, primarily to serve the static assets and enable `SharedArrayBuffer` for high-performance communication between the main thread and worker threads.

The core of the OS runs on the client-side:

*   **Kernel (`main.js`):** Lives on the main browser thread. It's responsible for managing the UI (windows, desktop), handling system calls, managing processes, and loading applications from the virtual filesystem.
*   **Virtual Machine (`vm.js`):** A custom bytecode interpreter that runs inside a Web Worker. This isolates application processes from the main UI thread, preventing them from blocking the user interface.
*   **Shared Memory (`SharedArrayBuffer`):** The kernel and the VM communicate efficiently using a shared memory buffer. This allows the VM to request system calls without the overhead of traditional message passing.
*   **Virtual Filesystem (`/public/fs`):** A directory structure containing application metadata and executable bytecode for the VM.

### System Infographic

Here is a diagram illustrating the flow of control and data within the application:

```mermaid
graph TD
    subgraph Browser
        subgraph Main Thread (Kernel)
            A[index.html / main.js]
        end
        subgraph Web Worker (Process)
            B[vm.js]
        end
    end

    subgraph "Node.js Backend"
        C[server.js]
    end

    User -- "Requests http://localhost:8080" --> C
    C -- "Serves static files (HTML, CSS, JS)" --> A
    A -- "Spawns Worker" --> B
    A -- "Manages UI / DOM" --> Desktop
    A <== "Syscall Request" ==> B
    B -- "Executes App Bytecode" --> B

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#ccf,stroke:#333,stroke-width:2px
    style C fill:#cfc,stroke:#333,stroke-width:2px
```

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) installed on your machine.

### Installation & Running

1.  **Clone the repository and install dependencies:**
    ```sh
    npm install
    ```

2.  **Start the server:**
    ```sh
    npm start
    ```

3.  **Open your browser** and navigate to `http://localhost:8080`.

## Project Structure

```
.
├── package.json       # Project dependencies and scripts
├── server.js          # Minimal Node.js static file server
├── public/            # Client-side assets
│   ├── index.html     # Main HTML file and UI structure
│   ├── style.css      # Stylesheets
│   ├── main.js        # OS Kernel
│   ├── vm.js          # Virtual Machine / CPU
│   └── fs/            # Virtual filesystem root
└── docs/
    └── syscall.md     # (Presumed) Documentation for system calls
```
