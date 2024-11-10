import React, { useState } from "react";
import { Button, Modal, Spin } from "antd";
const MessageModal = ({
  title,
  open,
  setOpen,
  sendMessage,
  isConnected,
  children,
}) => {
  const [loading, setLoading] = useState(false);

  const handleOk = (message) => {
    setLoading(true);
    setTimeout(() => {
      sendMessage(message);
      setLoading(false);
      setOpen(false);
    }, 1000);
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
            key="db"
            type="primary"
            onClick={handleOk}
            disabled={!isConnected}
          >
            Send Message
          </Button>,
        ]}
      >
        {children}
        <Spin spinning={loading} percent={"auto"} />
      </Modal>
    </>
  );
};
export default MessageModal;
