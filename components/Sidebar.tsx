"use client";

import SidebarNav from "./SidebarNav";

export default function Sidebar() {
  return (
    <div
      className="offcanvas-lg offcanvas-start sidebar-offcanvas border-end border-secondary-subtle"
      tabIndex={-1}
      id="sidebarOffcanvas"
      aria-labelledby="sidebarOffcanvasLabel"
    >
      <div className="offcanvas-header d-lg-none">
        <h5 className="offcanvas-title" id="sidebarOffcanvasLabel">
          Navegação
        </h5>
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          data-bs-target="#sidebarOffcanvas"
          aria-label="Fechar"
        />
      </div>
      <div className="offcanvas-body d-flex flex-column p-0">
        <SidebarNav />
      </div>
    </div>
  );
}
