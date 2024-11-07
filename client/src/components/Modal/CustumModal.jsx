import React, { useState } from "react";
import { Button, Modal } from "antd";
const CustomModal = ({ title, open, setOpen, func, children }) => {
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      func();
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <Modal
        open={open}
        title={title}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            color="danger"
            loading={loading}
            onClick={handleOk}
          >
            Delete
          </Button>,
        ]}
      >
        {children}
      </Modal>
    </>
  );
};
export default CustomModal;
