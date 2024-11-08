import React, { useState } from "react";
import { Button, Divider, Modal, Spin } from "antd";
const DeleteModal = ({ title, open, setOpen, func, data, children }) => {
  const [loading, setLoading] = useState(false);

  const handleOk = (option) => {
    setLoading(true);
    setTimeout(() => {
      func(option);
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
          <Button
            key="db"
            type="primary"
            onClick={() => {
              handleOk("deleteFromDB");
            }}
            danger
            disabled={!data?.types.includes("database")}
          >
            Delete from Database
          </Button>,
          <Button
            key="file"
            type="primary"
            onClick={() => {
              handleOk("deleteFromFile");
            }}
            danger
            disabled={!data?.types?.includes("file")}
          >
            Delete from File
          </Button>,
          <Button
            key="both"
            type="primary"
            onClick={() => {
              handleOk("deleteFromBoth");
            }}
            danger
            disabled={
              !data?.types?.includes("database") ||
              !data?.types?.includes("file")
            }
          >
            Delete from Both
          </Button>,
          <Divider key="divider" type="horizontal" />,
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
        ]}
      >
        {children}
        <Spin spinning={loading} percent={"auto"} />
      </Modal>
    </>
  );
};
export default DeleteModal;
