import { ReactNode } from "react";
import "./Modal.css";

interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
}

export default function Modal(props: ModalType) {
  return (
    <>
      {props.isOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            {props.children}
          </div>
        </div>
      )}
    </>
  );
}
