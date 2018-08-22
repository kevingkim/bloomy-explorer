import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

import ExpGraph from './ExpGraph.js';
import Viewer from './Viewer.js';

import { UsageLogs } from '../api/usageLogs.js';

image_prefix = "";
image_path = image_prefix + "";
// image_type = ".png";
image_type = ".jpg";
image_original = "";

// RADIUS_BIG1 = 135;
// RADIUS_SMALL1 = 75;
RADIUS_BIG1 = 90;
RADIUS_SMALL1 = 50;
dist = 28;

// App component - represents the whole app
export default class ExpGraphPage extends Component {

  _allData = [];
  _history = [];
  _historyLog = [];
  _dummyData = [];

  _modelUrls = [];


  // for sample data
  constructor(props) {
    super(props);
    var domainX = [0,100];
    var domainY = [0,100];

    image_path = image_prefix + "/db_" + this.props.AppState.expId + "/";
    image_original = image_path + "1111" + image_type;

    this.initData();

    this.state = {
      data: this.getData({x:domainX, y:domainY}),
      dummyData: this._dummyData,
      domain: {x:domainX, y:domainY},
      prevDomain: null,
      history: this.getHistory(),
    };

    this.loadModelUrls();

    this.props.saveLog(this.getCurrentNode().imageId,
        "initial node ("+this.getCurrentNode().id+")");
  }

  loadModelUrls() {
    // load 3d model urls
    var _self = this;
    var file = "/" + this.props.AppState.expId + "_modeldb.json";

    this.loadJSON(file, function(json) {
      _self._modelUrls = JSON.parse(json);
    });
  }

  loadJSON(file, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == 200) {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
  }

  findModelUrl(key) {
    for (var i=0; i<this._modelUrls.length; i++) {
      if (this._modelUrls[i].id == key) {
        return this._modelUrls[i].url
      }
    }
    return null;
  }

  initData() {

    var initialModelUrl = null;
    switch(this.props.AppState.expId) {
      case 'exp1':
        initialModelUrl1 = "https://create.bloomypro.com/embed/eyJpdiI6Ik54aXBkOUNWSEM0XC9VVDVDSndKalBnPT0iLCJ2YWx1ZSI6IkNGeEtDRU5PK0ZcL3ZOXC8zaDRCSHlNRHg0SDFXZ1RPS0h3eE5VSTZkRXZNb096d25ROGVnVUZmbVltT2ZpSVRMTFU1VTBKZlRGUWJ0XC9vNG9RUXpCaGxJakFPY3R3aHdXVVUxNVphaDFJXC9nSEM0OHJHYmQxaXhCXC9mRWZxbWtQZUkyYlkwcUdSTXI1T3pjVFNDMk8xSE1FRDJRU2hBNW1QQ0hySFZBc0NGaEFkcklWamk0R0lHQ0xFbkVGNTNVTWpOZmM2NUwzb2I0YVB1UXM0aXhTNmpOeVNWV2ZTRUVsdStUdHp0UHBGZTBWNE11R2JXYjFteFRvc29vRVlaY00raUVqTEpuaytqdDM4MTRCK3dkR3pDVHBHTXJpRktLK1VhXC9scjAzR0EyXC81VT0iLCJtYWMiOiJmYWYwMzAyMjNiNjE3ZWE3N2MwM2RjODZjOWU0NzA5NDI5YzY0MGMyYTMwOGRlZTk5YzE4OTQ0ZmIzZWNiY2U1In0=";
        initialModelUrl2 = "https://create.bloomypro.com/embed/eyJpdiI6IkxLNVdnaVRtTGRJdmVFM3YrajNaQWc9PSIsInZhbHVlIjoiTFBTdjV0aHpRaWNkcHFmcHUyRlU1RlNXV1JxZ1ptSXVDMnVDemZSVFpLWUlhT3BkT1FwR1I4TTFJanVtN0xHdFR2dEZOQk11WHBiK1dKMmR5cHFFbFRhWlVvMnJJVzNaRlhKR3N2aDdFYm9NTHBtbFBwWDM2dGh4NG9vMTA1T2UwTUpaZU9aV2tOVVwvcVdwRERiRDBoc0lvcGE5RVhYRFFNbXh2RzRIalNFZE1JOEI0OU5lcGlsTnF5SW5SSXV3eFVjblRiZjdDanRUeHIrcm8wTzRXUkdOOTNcL1VlN3hvZkM2YTBYMjlRSDl0RkM1NzNFZXNYZmsyT1FJdTBXSmpzWk1wYlNPcEpYZEtZQTB5Q2dhVWl4dmVoQURnTzRMSTdTT3M2SWlseHVjdz0iLCJtYWMiOiI3MmIwZDExNGI5NTdhYTNjYzM2NTYxMTY4M2Y0MGVjOTgyZjMxNzU2Njg1MGI5ZTViZTdhZDEzY2Y5ZWM0ZjZkIn0=";
        initialModelUrl3 = "https://create.bloomypro.com/embed/eyJpdiI6IldjUjFObFRaNWFnSmRGU2VyT0JodVE9PSIsInZhbHVlIjoiOGo1UWFpd0Z5WWVNNFZBS2xUaUZoTXUyejlUU3JBbndyamt5WmZraTJOc240ZFRLc2JiNCtKcGpBSTBQcVBMYjFRUGNGV3JtcVdtMjRyZWptQ0psSThBbXdXcGZCK1pMOGlLU3Y4cEJYY3c0SVV1RXJnVnd6OG80SWsyd0wxT3FaY1hKTVpwdUJKUVhyZ3MwOGVjNzhaUG45ZVIrUCtFZ3Zma1BmM3JQYXBBaVhvd2FmdDdJNnFOTHJLMW93V2FhQzFQVk40WUlOTjBSUEJrMis1TmdJcDdmT0Z3OEVwaTRUbForQlpvNEFjcUtGQ3daQkg0YVUwUkluOW8rWWtNRjdjM1RRcTVnQTlBQnhsbFR3N3duR2pzaW83eHpPT2NWVUpRSmthWmg4NzQ9IiwibWFjIjoiYTNkYjQ0ZjdkMjdlZjI1ZDJmZWY1ODgyZWI3YmQ4ODIxMzQ5YTJiYWYxNWE4MDgxY2I4ODhjMWRmNTFlYzAwYiJ9";
        initialModelUrl4 = "https://create.bloomypro.com/embed/eyJpdiI6Ik1kbitKWmxEbXM2akFCV3YwYmd2QWc9PSIsInZhbHVlIjoiNlVPZWxYa09RamZHdDFJSGlWaE13SmRRdzRzYk5HQmc4ODB0cU5pUlIrTEZuckVuakNsbGsrYnhJRWNsaHdVb2FMQUsxcmFzRDcyV1Y1NVNxOUR4VzhPVVRtbFdpVW5kcE0rRGFwU2tFaU9ZdkpVZlwvVVBzbXo5blIzVVJSa0M4T24ybWFlaldUYmlLYmRxOHhoaWw2MnpybDdkV2g3ZzFLcWs3YVJnaUdLM2NnRk9ReG03T2w2dEtmR1cxbDhYRkhCeWNMVGRYWnNBVHdcLzZJZ1k4RW1KaCtOQm5RZXliWlBqekV4bTZoVnNIVzVuWDRrejcyY3A2WVJFeW5cLzVhRFF1bWNKMWVxQU5NMkNTZHhOUXFiRkZZaWZhdjkwUXU5STcwTTMyamR4Rkk9IiwibWFjIjoiZDRmYjkwODVlNmI0NjQyMTM5NGI1MTBjYjE5ZmVkODdkMWQ5OGEzZGM2YTRhODIwMGI2YTdlNTNjZDJlYjI3YyJ9";
        initialModelUrl5 = "https://create.bloomypro.com/embed/eyJpdiI6IjJmbVVBZEx6T0twN0V0dTFndTc1dnc9PSIsInZhbHVlIjoiVkxLckdlRTVZUU1NajhrRDBcL1BjSDQ4dExZMlBnc2x5bURRXC9mc3o5NWJNZkpCdTJLWGxaM0c4eVdRUHlKYzJHNDl1UGZQZmlya0Vydk9IOERyQm9BR1RmV0owazBRd0h0aWhnb21cL2k0OEZNakc3WHhmd3A5T3c4aEt5V3RiVzNhUGVaRUJMNlFXYVVEZmc1bm9TMkZiajBNN1M3TEFNTXU2NHBCZExzMmoydjZsN2krSkdMVk0rWEdBWWtjeUFLSDZ1dUhXQmp0XC9ZS1NzMndsbFNxbHR4Um4ydGN6U0tCWUZ0UGY2MmVoUU5FdzZpWlR0dnltNXlnNzVjVzVEVDFWc1J5SnpUNStnM040dWJKaXN4T1FJZDJ2UHBcL0tkUUF2UkdUTlc5NHlsRT0iLCJtYWMiOiJmYmNmYjVkMDM0NWUyMDlhMTIwYTRlYzQ2ZWMzYjYyNmE4NjcwNjhiZWM3NThlNTI2ZGJhNjUwYzI5YTFhOGNkIn0=";
        break;
      case 'exp2':
        initialModelUrl1 = "https://create.bloomypro.com/embed/eyJpdiI6IldQMk4rdExud3dUMGpWckhrRFAzN2c9PSIsInZhbHVlIjoiZk5TVTdkZHd3MmtkWnZWV3BaSWdxekw3aEF4U3BYS0VrXC9samdKdU5hbkdqVmMweThmMEpIaXRFWnBSR0ZSRDZqVmM2azNCRm1ldXIrRGtJUU9jdHFSa0ZRTDMwMnM5clwvUzV6aTgzV3VCWmRGWm50aEd2b3dsazc5dFY5cmlQYjNQY3RoTjJBcXk2RVVrTVVRNnlrZlJhUys3SGRmWWZ0QzFRR2hKRGdqeFVtVjdwMXJRREVENHB4MmdpWE1YYTNYcXVuamFsSDI5ZlhuQ3licXBcL1BvNFBweTlxeFBiTk5HOUxXK2ljUzl5d09XNGlKMzBISjNVQkFoS0liTHNmbENzY1EwZnlSZnM5UU1FazZ5WDVnVjBLMEFzUEdZaWRIK0M2NW42QkNmYmM9IiwibWFjIjoiNzU0YTFhYmY5MTBmMGVkYzQ0MjE1NDM2NGNjMzBiYTA5MjI0OGI2NzdjY2Q0OWMxOTM1MzhmNDc3MGIxOTllOCJ9";
        initialModelUrl2 = "https://create.bloomypro.com/embed/eyJpdiI6IkNPT21CQ1ZrRzgxUEwrV0I1XC9GNGhBPT0iLCJ2YWx1ZSI6InFwVWRrOFBZYkdkSmJMSDVaYkpnSlhMV1lHTDQrS05WSXNENHRUZ2YxeGFxWTF6NXpaQXBlM0ZzQkhoRmVmY0Y0a040WGxMdlhEazNxQU9rdUZvMnJYRDRBa0J0OVlcL2hvV0tFVThveTJXWm8ybkM1M2ozQ1BPS0o1emR1UFwvcDJcL2FrRHoxS09BWUdzXC9Kdk5aako0MVlUOXZrYnhkSkJoQ3l3VEhqZ3pHVGk2V1wvNk9Sa3RpbVVPQld6RlVaS1NVdjlMRkFReENkQlFscGhWRjJ4T0xCbnRcLzV6ZEZPSjIzZm0zQkFcLzhES1dNSkZlUzdXZHNmOEhRUmZSSWsra1krTWdmeGk4OGFIWFBjc2hYRGtCSTBFVHJkK3p4UFBIWFdCc2tsM09vOEZaND0iLCJtYWMiOiJiZmEzYzJmYzJjNGMyMjkwOWM4OTMyNTc2MTdhMjdjYzgzNDBmZDYwZDQyYWM1MjM4M2NiOTVhMTA4N2E0OTg4In0=";
        initialModelUrl3 = "https://create.bloomypro.com/embed/eyJpdiI6Im8wRjFSNVRsOU9kQ05HVG9ZcE9DWFE9PSIsInZhbHVlIjoia2EyVmViUTlMbWZRVmJ3N3RCMFZQeXlVa2x4YTU0dUh2TmhTb1YrcDZrT3E3bnFmWXdxUTNHdFhHeEtwZjExTWhmdmZLR2E2QTc1RkM5OFwvTkdwTGZDM1YwTFZ6ZHdhc3loNHVYTGE3elk3WGNhZmlETDBETGxPaGExNDRadDZKKzlpNG9zWEQrdHhRR2x2SU43YTRWdFFQMlBcL2RKUXhTTUhxR3BcL3JPcU95dU05dmlIVmZsYlg0TVVnbW5TdkZtNFwvN2ViZEZ1MXNDNk1ETm5vbFg0MzZZUGxTYzVkdXVLc3J5SWZvWTRqTkUxazVmK1ZoTUFIcjU5VmJZbWFEbWc3RnlkeVB0cW9zYmtEcEZUN0U5MmJkaFlCZTA4a1ZtYnRrSk4rK0wrZ1RJPSIsIm1hYyI6ImVjMDAyY2M0ZWU4YzZhZDA5ZWVlNWQ0ZTRkZWVkNGMxMjgzOTJmOWI1OGQxMmRiYTA0MzJhM2ZjYzczNDY4MWUifQ==";
        initialModelUrl4 = "https://create.bloomypro.com/embed/eyJpdiI6IkdqcUhYZWFzSmVTWnkyU1BsM1dWalE9PSIsInZhbHVlIjoiZ0ZKcTRrWU1uMDRzRUExTmtLTGtWNG91RnF1cGYxZ1hubGZmYXpqMGVpYjdMNmF6czh0Vld5MVwvV1p6WW9ZRnpCMjZOZysrcU4rSFFvdGlkczlVcGJMZmdwNDhIZVZCWUR5QjhvcHNseUVoM2NSZFJJTkQ1czgxZHplQkw0alMyTlUwak5tcThNdll6UHJhM1JPNjhHeUd3OG5EVGY0U0lSeVhCY3Npek1IMzI0SjBuRDI5NWJvempxNVE2RVFCZlhFN09YcjhpN3RucTZpWFpiSmM5NFNTY2dcL0tabzloUlwvMlU3VHdcL2RwelZIMlYwNXZUNkV5ZCs0NFFKRUU1YjBuME5EM0V1bENtd01XQWw3XC9KeERiREk2WHBTeTZVeVRkbjhBXC9IZzd4V0k9IiwibWFjIjoiMzk0MjgyNjZhZGEyNTA5MGI4YzIwYTkyYjBkNTZjMjIzZjM2MmZlNjU4NDcxZGY3NDJhMTM0NzQzNWVjMWE1MiJ9";
        initialModelUrl5 = "https://create.bloomypro.com/embed/eyJpdiI6IkFHTGdiOGN2TWozREdyVExnMWZWN3c9PSIsInZhbHVlIjoiTU1FekRkckdFN3IrTWExcnVmcG9yam5qdlNXQzY0WVQ5WkZZemx5RjFGMTVBVlZVUFVpekhOb041U0NiUEMrXC8yTnBPOTM1R2xvVlJZa2VpZEt4RHMwN2F0TWFYdnBDSWVUYURLUVFXNnpWWEJGbHBrYjh2azN0a0htRFlYNXB2VHRCc0NrSXE3RnFQTWI4ZGM0RzBMdUlMb1V4MlhBcDVXU2lFQzRZdmhkb1wvaHR0WnNNYVBDZm5KVzhCOW1kMXR2bmd1d3ZtNFNkRStTOURid0syMDRqcXB6STdGeFliaHQ2WDFBa0N4V0xVemlmbFFIeGk3WXhZT0xDdFcwWVhyN2NobWNQT3lCYUZTNUlnT1IxM3ZhME9taFJFS2VyeURFUlBrK2Erc29pdz0iLCJtYWMiOiI2OWVmYWJlNTAzYTE0NWU4NDJiZTBlYjc0ODEyNDkyZDY2Yjk1ZjllODI3NmEwMTMyNWU0YmE3NjM2N2ZkOTg4In0=";
        break;
      default:
        initialModelUrl1 = "";
        initialModelUrl2 = "";
        initialModelUrl3 = "";
        initialModelUrl4 = "";
        initialModelUrl5 = "";
    }
    // initialize variables
    this._allData = [
      {x: 50, y: 50, z: RADIUS_BIG1,
        id: 'd1',
        parentId: 'd',
        parentX: 50, parentY: 50,
        numChildren: 4,
        focused: true, expanded: false, displayed: true,
        imageId: 1111,
        image: image_path + "1111" + image_type,
        modelUrl: initialModelUrl1,
      },
    ];

    var parentId = parseInt(1111);
    var childrenImageId = this.getChildrenImageId(parentId);

    this._allData.push(
      {x: 50-dist, y: 50+dist, z: RADIUS_SMALL1,
        id: 'd11',
        parentId: 'd1',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, expanded: false, displayed: true,
        imageId: childrenImageId[0],
        image: image_path + childrenImageId[0] + image_type,
        modelUrl: initialModelUrl2,
      },
      {x: 50-dist, y: 50-dist, z: RADIUS_SMALL1,
        id: 'd12',
        parentId: 'd1',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, expanded: false, displayed: true,
        imageId: childrenImageId[1],
        image: image_path + childrenImageId[1] + image_type,
        modelUrl: initialModelUrl3,
      },
      {x: 50+dist, y: 50+dist, z: RADIUS_SMALL1,
        id: 'd13',
        parentId: 'd1',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, expanded: false, displayed: true,
        imageId: childrenImageId[2],
        image: image_path + childrenImageId[2] + image_type,
        modelUrl: initialModelUrl4,
      },
      {x: 50+dist, y: 50-dist, z: RADIUS_SMALL1,
        id: 'd14',
        parentId: 'd1',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, expanded: false, displayed: true,
        imageId: childrenImageId[3],
        image: image_path + childrenImageId[3] + image_type,
        modelUrl: initialModelUrl5,
      },
    );

    this._history = [
      this._allData[0]
    ];

    this._historyLog = [];

    this._dummyData = [
      {x: 10, y: 90, z: 30, // 40
        id: 'Color',
        parentId: 'd0',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, expanded: false, displayed: false,
        imageId: "_01",
        image: image_path + "_01.jpg",
      },
      {x: 10, y: 10, z: 30, // 40
        id: 'Texture',
        parentId: 'd0',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, expanded: false, displayed: false,
        imageId: "_02",
        image: image_path + "_01.jpg",
      },
      {x: 90, y: 10, z: 30, // 40
        id: 'Space',
        parentId: 'd0',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, expanded: false, displayed: false,
        imageId: "_03",
        image: image_path + "_01.jpg",
      },
      {x: 90, y: 90, z: 30, // 40
        id: 'Form',
        parentId: 'd0',
        parentX: 50, parentY: 50,
        numChildren: 0,
        focused: false, expanded: false, displayed: false,
        imageId: "_04",
        image: image_path + "_01.jpg",
      },
    ];
  }

  getData(domain) {
    return _.filter(this._allData, this.isInDomain.bind(null, domain));
  }

  isInDomain(domain, d) {
    return d.displayed == true;
  }

  getHistory() {
    return this._history;
  }

  getCurrentNode() {
    return this._history[this._history.length-1];
    // return this._allData.filter( obj => obj.focused===true )[0];
  }

  handleNodeClick(domain, d) {
    if (d.focused === false) {
      // save log
      var direction = "default";
      var x = d.x - this.state.domain.x[0];
      var y = d.y - this.state.domain.y[0];
      if (x<50 && d.y<50)      direction = "TEXTURE";
      else if (x>50 && y<50) direction = "SPACE";
      else if (x<50 && y>50) direction = "COLOR";
      else if (x>50 && y>50) direction = "FORM";
      this.props.saveLog(d.imageId, "click "+direction+" ("+d.id+")");

      d.z = RADIUS_BIG1;
      d.focused = true;
      this._history.push(d);

      this._allData.filter( obj => obj.id===d.parentId)[0].focused = false;
      this._allData.filter( obj => obj.id===d.parentId)[0].displayed = false;

      var currentChildren = this._allData.filter( obj => obj.parentId===d.parentId);
      for (var i=0, len=currentChildren.length; i<len; i++) {
        if (currentChildren[i].id != d.id) {
          currentChildren[i].displayed = false;
        }
      }

      this.shiftPane(d);
      this.generateChildren(domain, d);
    }
    else if (d.focused === true) {

    }
  }

  shiftPane(d) {
    var newDomainX = [d.x-50, d.x+50];
    var newDomainY = [d.y-50, d.y+50];
    this.setAppState({
      data: this.getData({x:newDomainX, y:newDomainY}),
      domain: _.assign({}, this.state.domain, {
        x: newDomainX,
        y: newDomainY,
      }),
      prevDomain: null,
      history: this.getHistory(),
    });
  }

  generateChildren(domain, d) {
    childNum = [d.numChildren+1, d.numChildren+2, d.numChildren+3, d.numChildren+4];
    d.numChildren = d.numChildren+4;

    var parentId = parseInt(d.imageId);
    var childrenImageId = this.getChildrenImageId(parentId);

    this._allData.push(
      {x: d.x-dist, y: d.y+dist, z: RADIUS_SMALL1,
        id: d.id+childNum[0],
        parentId: d.id,
        parentX: d.x, parentY: d.y,
        numChildren: 0,
        focused: false, expanded: false, displayed: true,
        imageId: childrenImageId[0],
        image: image_path + childrenImageId[0] + image_type,
        modelUrl: this.findModelUrl(childrenImageId[0]),
      },
      {x: d.x-dist, y: d.y-dist, z: RADIUS_SMALL1,
        id: d.id+childNum[1],
        parentId: d.id,
        parentX: d.x, parentY: d.y,
        numChildren: 0,
        focused: false, expanded: false, displayed: true,
        imageId: childrenImageId[1],
        image: image_path + childrenImageId[1] + image_type,
        modelUrl: this.findModelUrl(childrenImageId[1]),
      },
      {x: d.x+dist, y: d.y+dist, z: RADIUS_SMALL1,
        id: d.id+childNum[2],
        parentId: d.id,
        parentX: d.x, parentY: d.y,
        numChildren: 0,
        focused: false, expanded: false, displayed: true,
        imageId: childrenImageId[2],
        image: image_path + childrenImageId[2] + image_type,
        modelUrl: this.findModelUrl(childrenImageId[2]),
      },
      {x: d.x+dist, y: d.y-dist, z: RADIUS_SMALL1,
        id: d.id+childNum[3],
        parentId: d.id,
        parentX: d.x, parentY: d.y,
        numChildren: 0,
        focused: false, expanded: false, displayed: true,
        imageId: childrenImageId[3],
        image: image_path + childrenImageId[3] + image_type,
        modelUrl: this.findModelUrl(childrenImageId[3]),
      },
    );

    this.setAppState({
      data: this.getData(this.state.domain),
      prevDomain: null
    });

  }

  getChildrenImageId (parentId) {
    var childrenId = [parentId+1000, parentId+100, parentId+10, parentId+1];

    for (var i=0; i<childrenId.length; i++) {
      childrenId[i] = childrenId[i].toString().replace("4", "1");
    }

    return childrenId;
  }

  handleHistoryClick (domain, d) {
    var children = this._allData.filter( obj => obj.id.length > d.id.length );
    this.pruneChildren(children);

    // save log
    this.props.saveLog(d.imageId, "history click ("+d.id+")");

    for (var i=0; i<this._allData.length; i++) {
      this._allData[i].focused = false;
      this._allData[i].displayed = false;
    }

    d.expanded = false;
    d.focused = true;
    d.displayed = true;
    d.numChildren = 0;

    // store history
    this._historyLog.push(Object.assign({}, this._history));

    // update history
    for (var i=this._history.length-1; i>=0; i--) {
      if (this._history[i].id == d.id) {
        break;
      }
      // console.log(this._history[i].id);
      this._history = this._history.slice(0,i);
    }

    this.shiftPane(d);
    this.generateChildren(this.state.domain, d);

  }

  pruneChildren(children) {
    for (var i=0, len=children.length; i<len; i++) {
      this._allData = _.reject(this._allData, {id: children[i].id});
    }

    this.setAppState({
      data: this.getData(this.state.domain),
      prevDomain: null
    });
  }

  setAppState(partialState, callback) {
    return this.setState(partialState, callback);
  }

  renderTaskDescription() {
    var taskDescription = "";
    switch(this.props.AppState.expId) {
      case "trial":
        taskDescription = "Task description: Find red dotted squares that are tightly-spaced in linear formation";
        break;
      case "exp1":
        taskDescription = "Task description: Mrs. Heinrich, an 80-year-old regular customer, would like to buy a bouquet for her birthday party. The bouquet should stand on the dining table. The apartment is furnished in a romantic style. Her birthday is in summer.";
        break;
      case "exp2":
        taskDescription = "Task description: A young woman enters your shop, whom you have not seen before. She is interested in a round hand-bound bridal bouquet. The wedding will take place at the end of May and the bride will wear white. She informs them that she likes natural flowers and the colour purple.";
      default:
        break;
    }
    return (taskDescription);
  }

  render() {
    return (
      <div className="containder">
        <div className="description">
          {this.renderTaskDescription()}
        </div>
        <div className="subContainer">
          <ExpGraph
            width={this.props.graphWidth}
            height={this.props.height}
            appState={this.state}
            setAppState={this.setAppState.bind(this)}
            handleNodeClick={this.handleNodeClick.bind(this)}
            handleHistoryClick={this.handleHistoryClick.bind(this)}
          />

          <Viewer
            width={this.props.viewerWidth}
            height={this.props.height}
            appState={this.state}
            getCurrentNode={this.getCurrentNode.bind(this)}
          />
        </div>

        <div className="description">
          <button className="button" onClick={this.props.handleClickFinish.bind(this)}>
            Finish
          </button>
          <button className="button" onClick={this.props.handleClickExit.bind(this)}>
            Exit
          </button>
        </div>
      </div>

    );
  }

}
