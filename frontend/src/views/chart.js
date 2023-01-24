import { useState, useEffect, React } from "react";
import { Bar, Scatter } from "react-chartjs-2";
import { SearchOutlined } from '@ant-design/icons';
import { Select, DatePicker, Button, message, Input } from "antd";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
} from "reactstrap";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
import { faker } from '@faker-js/faker';

import { timeLabel, monthLabel, weekLabel, seasonLabel } from '../config.js';

const { Option } = Select;

const PickerWithType = ({ type, onChange }) => {
  if (type === 'season') return (
    <DatePicker
      style={{
        width: "100%",
      }}
      picker='year' onChange={onChange} />);
  if (type === 'date') return <DatePicker
    style={{
      width: "100%",
    }}
    onChange={onChange} />;
  return <DatePicker
    style={{
      width: "100%",
    }}
    picker={type} onChange={onChange} />;
};

dayjs.extend(customParseFormat);

const Index = () => {

  const [messageApi, contextHolder] = message.useMessage();

  const [type, setType] = useState('year');
  const [date, setDate] = useState();
  const [location, setLocation] = useState();
  let [search, setSearch] = useState(0);

  const [labels, setLabels] = useState([]);
  const [optionsBar, setOptionsBar] = useState();
  const [optionsScatter, setOptionsScatter] = useState();
  const [dataBar, setDataBar] = useState();
  const [dataScatter, setDataScatter] = useState();
  const [locationID, setLocationID] = useState();

  useEffect(() => {
    handleSearch();
  }, [search]);

  const handleChangeDate = (value) => {
    setDate(value);
  };

  const onChangeLocation = (e) => {
    if (e.target !== undefined) setLocation(e.target.value);
    else setLocation(e.name);
  }

  const datasetKeyProvider = () => {
    return "Not";
  }

  const handleSearch = () => {
    if (!location) {
      return;
    }
    let data;
    if (type === 'season') {
      data = {
        type: type,
        date: date.$y,
        location: locationID
      }
    } else {
      data = {
        type: type,
        date: date,
        location: locationID
      }
    }
    console.log("Data:", data);

    let result;
    axios.post(process.env.REACT_APP_API_URL + "/survey/getSurvey", data)
      .then(res => {
        if(res.data.success) {
          result = res.data.result;
          console.log("Result:", result);
          let label, barData;
          switch (type) {
            case 'date': {
              label = timeLabel;
              let arr = new Array(6).fill(0);
              result.forEach(data => {
                arr[data.time - 1]++;
              })
              barData = arr;
              break;
            }
            case 'month': {
              label = weekLabel;
              let arr = new Array(5).fill(0);
              result.forEach(data => {
                let day = parseInt(result[0].date.slice(8,10))
                if(day<8 && day>0) arr[0]++;
                else if(day<15 && day>7) arr[1]++;
                else if(day<22 && day>14) arr[2]++;
                else if(day<29 && day>21) arr[3]++;
                else arr[4]++;
              })
              barData = arr;
              break;
            }
            case 'year': {
              label = monthLabel;
              let arr = new Array(12).fill(0);
              result.forEach(data => {
                let month = parseInt(data.date.slice(5,7))
                arr[month - 1]++;
              })
              barData = arr;
              break;
            }
            case 'season': {
              label = seasonLabel;
              let arr = new Array(4).fill(0);
              result.forEach(data => {
                switch (data.season) {
                  case 'Spring':
                    arr[0]++;
                    break;
                  case 'Summer':
                    arr[1]++;
                    break;
                  case 'Fall':
                    arr[2]++;
                    break;
                  case 'Winter':
                    arr[3]++;
                    break;
                  default: break;
                }
              })
              barData = arr;
              break;
            }
            default: {
              label = monthLabel;
              break;
            }
          }

          setLabels(label);

          setOptionsBar({
            responsive: true,
            plugins: {
              legend: {
                position: 'top as const,'
              },
              title: {
                display: true,
                text: 'Chart.js Bar Chart',
              },
            },
            scales: {
              y: {
                ticks: {
                  callback: function (value, index, ticks) {
                    return '$' + value;
                  }
                }
              }
            }
          });

          setOptionsScatter({
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          });

          setDataBar({
            labels,
            datasets: [
              {
                label: location,
                data: barData,
                backgroundColor: 'rgba(255, 22, 22, 0.7)',
                fill: true
              },
            ],
          });

          setDataScatter({
            datasets: [
              {
                label: 'Begineer',
                data: Array.from({ length: 20 }, () => ({
                  x: faker.datatype.number({ min: 0, max: 24 }),
                  y: faker.datatype.number({ min: 0, max: 50 }),
                })),
                backgroundColor: 'rgba(53, 162, 235, 1)',
              },
              {
                label: 'Intermediary',
                data: Array.from({ length: 20 }, () => ({
                  x: faker.datatype.number({ min: 0, max: 24 }),
                  y: faker.datatype.number({ min: 0, max: 50 }),
                })),
                backgroundColor: 'rgba(255, 99, 132, 1)',
              },
              {
                label: 'Advanced',
                data: Array.from({ length: 20 }, () => ({
                  x: faker.datatype.number({ min: 0, max: 24 }),
                  y: faker.datatype.number({ min: 0, max: 50 }),
                })),
                backgroundColor: 'rgba(0, 0, 0, 1)',
              },
            ],
          });

          setSearch(true);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  let google = window.google;
  let input = document.getElementById('searchTextField');
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();

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
      {contextHolder}
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            <Row>
              <Col lg="6" xl="2">
                <h3 style={{ color: "white" }}>Search Option:</h3>
              </Col>
              <Col lg="6" xl="2">
                <Input
                  id="searchTextField"
                  onChange={onChangeLocation}
                  value={location ? location : ''}
                  placeholder="Input park name"
                />
              </Col>
              <Col lg="6" xl="2">
                <Select
                  style={{
                    width: "100%",
                  }}
                  value={type}
                  onChange={setType}
                >
                  <Option value="date">Date</Option>
                  <Option value="month">Month</Option>
                  <Option value="season">Season</Option>
                  <Option value="year">Year</Option>
                </Select>
              </Col>
              <Col lg="6" xl="2">
                <PickerWithType
                  type={type}
                  onChange={handleChangeDate}
                />
              </Col>
              <Col lg="6" xl="1">
                <Button icon={<SearchOutlined />} onClick={() => {
                  if (!location) {
                    messageApi.open({
                      type: 'error',
                      content: 'Please input the park name',
                    });
                    return;
                  }
                  setSearch(search + 1);
                }}>
                  Search
                </Button>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <Container className="mt--7" fluid>
        <Row>
          <Col lg="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h2 className="mb-0">Usage of the park</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <Bar options={optionsBar} data={dataBar} datasetKeyProvider={datasetKeyProvider} />
              </CardBody>
            </Card>
          </Col>

          <Col lg="6">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h2 className="mb-0">Usage of the park</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <Scatter options={optionsScatter} data={dataScatter} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

    </>
  );
};

export default Index;

