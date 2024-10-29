import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { configureSerial, setConfig } from "./configSlice";
import { Button, Form, Input, Space, Switch } from "antd";

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const ConfigForm = ({ baseURL }) => {
  const dispatch = useDispatch();
  const { config, lastMessage, status, error } = useSelector(
    (state) => state.serialConfig
  );

  const [autoLog, setAutoLog] = useState(config.autoLog);
  const [deploy, setDeploy] = useState(false);

  const deployConfiguration = () => {
    dispatch(configureSerial({ baseURL: baseURL, config: config }));
    setTimeout(() => {
      if (deploy) {
        setDeploy(false);
      }
    }, 10000);
  };

  const onFinish = (values) => {
    const configInput = {
      comport: values.comport,
      baudrate: values.baudrate,
      logToFile: !!values.logToFile,
      logToDatabase: !!values.logToDatabase,
      mongoConfig: {
        url: values.mongoDbUrl,
      },
      fileFormat: values.fileFormat || "json",
      autoLog: values.autoLog,
      autoDelete: {
        enabled: values.autoDelete > 0 ? true : false,
        deleteAfterDays: values.autoDelete,
      },
    };
    // verify forms value
    if (values.autoLog) {
      if (!(values.logToFile || values.logToDatabase)) {
        alert(
          "You have selected auto log active. Please select log to file or log to database or both."
        );
        return;
      }
    }
    // save configuration
    dispatch(setConfig(configInput));
    setDeploy(true);
  };

  return (
    <div>
      <Form
        name="Set Config"
        {...formItemLayout}
        onFinish={onFinish}
        initialValues={{
          comport: config.comport,
          baudrate: config.baudrate,
          logToFile: config.logToFile,
          logToDatabase: config.logToDatabase,
          autoLog: config.autoLog,
          fileFormat: config.fileFormat === "text" ? "text" : "json",
          mongoDbUrl: config.mongoConfig.url,
          autoDelete: config.autoDelete.deleteAfterDays,
        }}
        disabled={deploy}
      >
        <Form.Item name="comport" label="Comport">
          <Input type="text" placeholder="Enter comport ex: COM15" required />
        </Form.Item>
        <Form.Item name="baudrate" label="Baudrate">
          <Input type="number" placeholder="Enter baudrate ex: 9600" required />
        </Form.Item>
        <Form.Item name="autoLog" label="Auto Log" valuePropName="checked">
          <Switch onChange={(e) => setAutoLog(e)} />
        </Form.Item>
        {autoLog && (
          <Form.Item
            name="logToFile"
            label="Log To File"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        )}
        {autoLog && (
          <Form.Item
            name="logToDatabase"
            label="Log To Database"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        )}
        {autoLog && (
          <Form.Item
            name="fileFormat"
            label="File format"
            valuePropName="checked"
          >
            <Switch checkedChildren="Text" unCheckedChildren="JSON" />
          </Form.Item>
        )}
        <Form.Item name="mongoDbUrl" label="MongoDB URL">
          <Input
            type="url"
            placeholder="Enter mongo db url ex: mongodb://localhost:27017/dataLogger"
            required
          />
        </Form.Item>
        <Form.Item name="autoDelete" label="Auto Delete After">
          <Input
            addonAfter="days"
            type="number"
            placeholder="Auto delete after"
            required
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Space>
            <Button type="primary" htmlType="submit">
              Save configuration
            </Button>
            <Button htmlType="reset">reset</Button>
          </Space>
        </Form.Item>
      </Form>
      {deploy && (
        <div className="text-center">
          <Button onClick={deployConfiguration} disabled={status === "loading"}>
            Deploy configuration
          </Button>
          {status === "succeeded" && <p>Configuratiion deployed</p>}
          {status === "failed" && <p>Error: {error}</p>}
        </div>
      )}
      {lastMessage && (
        <p className="text-center">Last deployed message: {lastMessage}</p>
      )}
    </div>
  );
};

export default ConfigForm;
