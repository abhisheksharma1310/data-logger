import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyBaseURL, setStatus, setBaseUrl } from "./baseUrlSlice";
import { Button, Form, Input, Space } from "antd";
import ConfigForm from "./ConfigForm";
import Loading from "../../components/feedbacks/Loading";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const SerialConfig = () => {
  const dispatch = useDispatch();
  const { baseURL, status, error } = useSelector((state) => state.baseUrl);

  const onFinish = (values) => {
    const baseUrlInput = values.baseURL;
    dispatch(setBaseUrl(baseUrlInput));
    dispatch(verifyBaseURL({ baseURL: baseUrlInput }));
  };

  const handleUrlEdit = () => {
    const ans = prompt(`Are you soure to edit server base url?
        If yes type YES.
        `);
    if (ans === "YES") {
      dispatch(setStatus("idle"));
    }
  };

  return (
    <div>
      <Form
        name="Set BaseUrl"
        {...formItemLayout}
        onFinish={onFinish}
        initialValues={{
          baseURL: baseURL,
        }}
      >
        <Form.Item name="baseURL" label="Server base URL">
          <Input
            type="url"
            placeholder="Enter server base url ex: http://127.0.0.1:5000"
            required
            disabled={status === "succeeded"}
            suffix={
              status === "succeeded" && (
                <Button onClick={handleUrlEdit}>Edit</Button>
              )
            }
          />
        </Form.Item>
        {!(status === "succeeded") && (
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Verify
              </Button>
              <Button htmlType="reset">reset</Button>
            </Space>
          </Form.Item>
        )}
      </Form>
      <div className="text-center">
        <Loading isLoading={status === "loading"} />
        {status === "succeeded" && (
          <p>Server url is verified and it is working.</p>
        )}
        {status === "failed" && <p>Error: {error}</p>}
      </div>
      {status === "succeeded" && <ConfigForm baseURL={baseURL} />}
    </div>
  );
};

export default SerialConfig;
