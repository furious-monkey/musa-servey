import { useEffect, useState } from "react";
import Chart from "chart.js";
import { Select, Input, Button, Row, Col, message } from "antd";
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import dayjs from "dayjs";
import { Card, CardHeader, CardBody, Container } from "reactstrap";
import { chartOptions, parseOptions } from "variables/charts.js";

import Header from "components/Headers/Header.js";

dayjs.extend(customParseFormat);
const baseURL = process.env.REACT_APP_API_URL;
var place;
const levelSendData = [];
const daySendData = [];
const timeSendData = [];
const seasonSendData = [];
const locationSendID = [];

const CardItem = ({ cardIndex, totalCount, addColsHandle, removeColsHandle }) => {
  const [levelData, setLevel] = useState();
  const [locationData, setLocation] = useState();
  const [dayData, setDay] = useState();
  const [timeData, setTime] = useState();
  const [seasonData, setSeason] = useState();
  const [locationID, setLocationID] = useState();
  const [addState, setAddState] = useState(true);

  useEffect(() => {
    if (levelData && dayData && timeData && seasonData && locationID)
      setAddState(false)
    else
      setAddState(true)
  })

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const onChangeLevel = (value) => {
    setLevel(value);
    if (levelSendData.length === 0) {
      console.log("level: ", value);
      levelSendData.push(value)
    }
  };
  const onChangeTime = (value) => {
    setTime(value);
    if (timeSendData.length === 0) {
      console.log("time: ", value);
      timeSendData.push(value)
    }
  };
  const onChangeSeason = (value) => {
    setSeason(value);
    if (seasonSendData.length === 0) {
      console.log("season: ", value);
      seasonSendData.push(value)
    }
  };
  const onChangeDay = (value) => {
    setDay(value);
    if (daySendData.length === 0) {
      console.log("day: ", value);
      daySendData.push(value)
    }
  };
  const onChangeLocation = (e) => {
    if (e.target !== undefined) {
      console.log("location: ", e.target.value);
      setLocation(e.target.value);
    }
    else {
      setLocation(e.name);
      if (locationSendID.length === 0) {
        console.log("location: ", e.name);
        locationSendID.push(e.name)
      }
    }
  };
  const addColsHandler = () => {
    levelSendData.push(levelData)
    daySendData.push(dayData)
    timeSendData.push(timeData)
    seasonSendData.push(seasonData)
    locationSendID.push(locationID)
    addColsHandle()
  }
  let google = window.google;
  let input = document.getElementById("searchTextField" + cardIndex);
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener("place_changed", () => {
    place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      return;
    }
    onChangeLocation({
      name: place.name,
      address: place.formatted_address,
      id: place.place_id,
    });
    setLocationID(place.place_id);
  });
  return (
    <>
      <Col span={24}>
        <Card style={{ border: 'none' }}>
          <Row gutter={[3, 8]} className="content-input">
            <Col className="col-content">
              <Input
                style={{ width: "100%" }}
                id={"searchTextField" + cardIndex}
                onChange={onChangeLocation}
                value={locationData ? locationData : ""}
                placeholder="What park do you go to?"
              />
            </Col>
            <Col className="col-content">
              <Select
                placeholder="What day(s) do you go?"
                style={{ width: "100%" }}
                onChange={onChangeDay}
                options={[
                  {
                    value: "Monday",
                    label: "Monday",
                  },
                  {
                    value: "Tuesday",
                    label: "Tuesday",
                  },
                  {
                    value: "Wednesday",
                    label: "Wednesday",
                  },
                  {
                    value: "Thursday",
                    label: "Thursday",
                  },
                  {
                    value: "Friday",
                    label: "Friday",
                  },
                ]}
              />
            </Col>
            <Col className="col-content">
              <Select
                placeholder="Select Time"
                style={{ width: "100%" }}
                onChange={onChangeTime}
                options={[
                  {
                    value: 1,
                    label: "04:00am-08:00am",
                  },
                  {
                    value: 2,
                    label: "08:00am-12:00pm",
                  },
                  {
                    value: 3,
                    label: "01:00pm-04:00pm",
                  },
                  {
                    value: 4,
                    label: "04:00pm-07:00pm",
                  },
                  {
                    value: 5,
                    label: "07:00pm-10:00pm",
                  },
                  {
                    value: 6,
                    label: "10:00pm-until later",
                  },
                ]}
              />
            </Col>
            <Col className="col-content">
              <Select
                placeholder="Skill Level"
                style={{ width: "100%" }}
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
            </Col>
            <Col className="col-content">
              <Select
                placeholder="Season"
                style={{ width: "100%" }}
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
            </Col>
            <Col className="col-content plus-button">
              {
                cardIndex === totalCount
                  ? <Button type="primary" disabled={addState} shape="circle" onClick={addColsHandler} style={{ marginTop: '4px', marginLeft: "10px" }} icon={<PlusOutlined style={{ display: "block" }} />} size={"small"} />
                  : <></>
              }
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  );
};

const Index = (props) => {
  let history = useHistory();

  const [colCount, setColCount] = useState(1);
  const [messageApi, contextHolder] = message.useMessage();

  let cols = [];
  for (let i = 0; i < colCount; i++) {
    cols.push(<CardItem key={i} cardIndex={i} totalCount={colCount - 1} addColsHandle={() => {
      setColCount(colCount + 1);
    }} />)
  }

  const onFinish = () => {
    const addData = {
      level: levelSendData,
      location: locationSendID,
      day: daySendData,
      time: timeSendData,
      season: seasonSendData,
    };
    console.log(addData)
    if (!locationSendID.length || !levelSendData.length || !daySendData.length || !timeSendData.length || !seasonSendData.length) {
      messageApi.open({
        type: 'error',
        content: 'Please input at least one field set and click PLUS (+) button.',
      });
    } else {
      axios
        .post(baseURL + "/survey/createSurvey", addData)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(levelSendData, seasonSendData, timeSendData, daySendData, locationSendID);
      history.push("/admin/chart");
      window.location.reload();
    }
  };

  return (
    <>
      {contextHolder}
      <Header />
      <Container fluid style={{ paddingTop: '5%', paddingBottom: '20%' }}>
        <Card className="shadow">
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
            <Row gutter={[0, 8]}>
              {cols}
              <div class="ant-col ant-col-24 custom-css button-div">
                <Button type="primary" shape="round" onClick={onFinish} className="continue-button">Continue<ArrowRightOutlined style={{ display: `inline-flex` }} /></Button>
              </div>
            </Row>

          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default Index;
