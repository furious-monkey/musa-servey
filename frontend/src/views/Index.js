import { useEffect, useState } from "react";
import Chart from "chart.js";
import { Form, Select, DatePicker, Input, Button } from "antd";
import { useHistory } from "react-router-dom";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import dayjs from "dayjs";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row
} from "reactstrap";
import {
  chartOptions,
  parseOptions
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

dayjs.extend(customParseFormat);
const baseURL = process.env.REACT_APP_API_URL;
var place;

const Index = (props) => {
  let history = useHistory();

  const [levelData, setLevel] = useState();
  const [locationData, setLocation] = useState();
  const [dateData, setDate] = useState();
  const [timeData, setTime] = useState();
  const [seasonData, setSeason] = useState();
  const [locationID, setLocationID] = useState();

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const onChangeLevel = (value) => {
    setLevel(value);
  };
  const onChangeTime = (value) => {
    setTime(value);
  };
  const onChangeSeason = (value) => {
    setSeason(value);
  };
  const onChangeDate = (date, dateString) => {
    setDate(dateString);
  };
  const onChangeLocation = (e) => {
    if (e.target !== undefined) setLocation(e.target.value);
    else setLocation(e.name);
  }
  const disabledDate = (current) => {
    return current < dayjs().endOf("day");
  };

  const onFinish = () => {
    const addData = {
      level: levelData,
      location: locationID,
      date: dateData,
      time: timeData,
      season: seasonData,
    };
    axios.post(baseURL + "/survey/createSurvey", addData)
      .then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    history.push("/admin/chart");
    window.location.reload()
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  let google = window.google;
  let input = document.getElementById('searchTextField');
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener("place_changed", () => {
    place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      return;
    }
    onChangeLocation({
      name: place.name,
      address: place.formatted_address,
      id: place.place_id
    });
    setLocationID(place.place_id);
  });

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Card className="shadow" style={{ height: `600px` }}>
          <CardHeader className="bg-transparent">
            <Row className="align-items-center">
              <div className="col">
                <h6 className="text-uppercase text-muted ls-1 mb-1">
                  search condition
                </h6>
                <h2 className="mb-0">Input to all fields.</h2>
              </div>
            </Row>
          </CardHeader>
          <CardBody>
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 12 }}
              layout="horizontal"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Park"
              >
                <Input
                  id="searchTextField"
                  onChange={onChangeLocation}
                  value={locationData ? locationData : ''}
                  placeholder="Input park name"
                />
              </Form.Item>
              <Form.Item
                style={{ fontSize: 20 }}
                label="Level"
                name="player"
                rules={[
                  {
                    required: true,
                    message: "Please input your level!",
                  },
                ]}
              >
                <Select
                  onChange={onChangeLevel}
                  options={[
                    {
                      value: "Beginner",
                      label: "Beginner",
                    },
                    {
                      value: "Intermediary",
                      label: "Intermediary",
                    },
                    {
                      value: "Advanced",
                      label: "Advanced",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="date"
                label="Date"
                rules={[
                  {
                    required: true,
                    message: "Please input your date!",
                  },
                ]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  onChange={onChangeDate}
                  disabledDate={disabledDate}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item
                name="time"
                label="Time"
                rules={[
                  {
                    required: true,
                    message: "Please input your time!",
                  },
                ]}
              >
                <Select
                  onChange={onChangeTime}
                  options={[
                    {
                      value: 1,
                      label: "08:00am-10:00am",
                    },
                    {
                      value: 2,
                      label: "10:00am-12:00pm",
                    },
                    {
                      value: 3,
                      label: "12:00pm-02:00pm",
                    },
                    {
                      value: 4,
                      label: "03:00pm-05:00pm",
                    },
                    {
                      value: 5,
                      label: "06:00pm-08:00pm",
                    },
                    {
                      value: 6,
                      label: "09:00pm-11:00pm",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="season"
                label="Season"
                rules={[
                  {
                    required: true,
                    message: "Please input season!",
                  },
                ]}
              >
                <Select
                  onChange={onChangeSeason}
                  options={[
                    {
                      value: "Spring",
                      label: "Spring",
                    },
                    {
                      value: "Summer",
                      label: "Summer",
                    },
                    {
                      value: "Fall",
                      label: "Fall",
                    },
                    {
                      value: "Winter",
                      label: "Winter",
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16
                }}
              >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default Index;
