Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _reactNative = require('react-native');

var _reactNativeDropdownalert = require('react-native-dropdownalert');

var _reactNativeDropdownalert2 = babelHelpers.interopRequireDefault(_reactNativeDropdownalert);

var _reactNativeFileProvider = require('react-native-file-provider');

var _reactNativeFileProvider2 = babelHelpers.interopRequireDefault(_reactNativeFileProvider);

var _reactNativeSound = require('react-native-sound');

var _reactNativeSound2 = babelHelpers.interopRequireDefault(_reactNativeSound);

var _reactNativeAudio = require('react-native-audio');

var RNFS = require('react-native-fs');

var stop = require("../images/stop.png");
var record = require("../images/recordStart.png");
var pause = require("../images/pause.png");

var Recordings = function (_Component) {
  babelHelpers.inherits(Recordings, _Component);

  function Recordings(props) {
    babelHelpers.classCallCheck(this, Recordings);

    var _this = babelHelpers.possibleConstructorReturn(this, (Recordings.__proto__ || Object.getPrototypeOf(Recordings)).call(this, props));

    _this.showAlert = _this.showAlert.bind(_this);
    _this.state = {
      time: new Date(),
      name: "",
      currentTime: 0.0,
      recording: false,
      stoppedRecording: false,
      finished: false,
      audioPath: RNFS.ExternalStorageDirectoryPath + '/test.aac',
      hasPermission: undefined
    };
    return _this;
  }

  babelHelpers.createClass(Recordings, [{
    key: 'prepareRecordingPath',
    value: function prepareRecordingPath(audioPath) {
      _reactNativeAudio.AudioRecorder.prepareRecordingAtPath(audioPath, {
        SampleRate: 22050,
        Channels: 1,
        AudioQuality: "Low",
        AudioEncoding: "aac",
        AudioEncodingBitRate: 32000
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this._checkPermission().then(function (hasPermission) {
        _this2.setState({ hasPermission: hasPermission });

        if (!hasPermission) return;

        _this2.prepareRecordingPath(_this2.state.audioPath);

        _reactNativeAudio.AudioRecorder.onProgress = function (data) {
          _this2.setState({ currentTime: Math.floor(data.currentTime) });
        };

        _reactNativeAudio.AudioRecorder.onFinished = function (data) {
          if (_reactNative.Platform.OS === 'ios') {
            _this2._finishRecording(data.status === "OK", data.audioFileURL);
          }
        };
      });
    }
  }, {
    key: '_checkPermission',
    value: function _checkPermission() {
      if (_reactNative.Platform.OS !== 'android') {
        return Promise.resolve(true);
      }

      var rationale = {
        'title': 'Microphone Permission',
        'message': 'Recordings needs access to your microphone.'
      };

      return _reactNative.PermissionsAndroid.request(_reactNative.PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale).then(function (result) {
        console.log('Permission result:', result);
        return result === true || result === _reactNative.PermissionsAndroid.RESULTS.GRANTED;
      });
    }
  }, {
    key: '_buttonValue',
    value: function _buttonValue(title, onPress, active) {
      var style = active ? styles.activeButtonText : styles.buttonText;

      return _react2.default.createElement(
        _reactNative.TouchableHighlight,
        { onPress: onPress },
        _react2.default.createElement(_reactNative.Image, { style: styles.buttonImage, source: title })
      );
    }
  }, {
    key: '_pause',
    value: function _pause() {
      var filePath;
      return regeneratorRuntime.async(function _pause$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (this.state.recording) {
                _context.next = 3;
                break;
              }

              console.warn('Can\'t pause, not recording!');
              return _context.abrupt('return');

            case 3:

              this.setState({ stoppedRecording: true, recording: false });

              _context.prev = 4;
              _context.next = 7;
              return regeneratorRuntime.awrap(_reactNativeAudio.AudioRecorder.pauseRecording());

            case 7:
              filePath = _context.sent;

              if (_reactNative.Platform.OS === 'android') {
                this._finishRecording(true, filePath);
              }
              _context.next = 14;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context['catch'](4);

              console.error(_context.t0);

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this, [[4, 11]]);
    }
  }, {
    key: '_stop',
    value: function _stop() {
      var filePath;
      return regeneratorRuntime.async(function _stop$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (this.state.recording) {
                _context2.next = 3;
                break;
              }

              console.warn('Can\'t stop, not recording!');
              return _context2.abrupt('return');

            case 3:

              this.setState({ stoppedRecording: true, recording: false });
              this.setState({ currentTime: 0 });

              _context2.prev = 5;
              _context2.next = 8;
              return regeneratorRuntime.awrap(_reactNativeAudio.AudioRecorder.stopRecording());

            case 8:
              filePath = _context2.sent;


              if (_reactNative.Platform.OS === 'android') {
                this._finishRecording.bind(true, filePath);
                this.props.recordTime(this.state.time);
                this.props.audioPath(this.state.audioPath);
                this.props.recording(this.state.recording);
              }
              return _context2.abrupt('return', filePath);

            case 13:
              _context2.prev = 13;
              _context2.t0 = _context2['catch'](5);

              console.error(_context2.t0);

            case 16:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this, [[5, 13]]);
    }
  }, {
    key: '_record',
    value: function _record() {
      var filePath;
      return regeneratorRuntime.async(function _record$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!this.state.recording) {
                _context3.next = 3;
                break;
              }

              console.warn('Already recording!');
              return _context3.abrupt('return');

            case 3:
              if (this.state.hasPermission) {
                _context3.next = 6;
                break;
              }

              console.warn('Can\'t record, no permission granted!');
              return _context3.abrupt('return');

            case 6:

              if (this.state.stoppedRecording) {
                this.prepareRecordingPath(this.state.audioPath);
              }

              this.setState({ recording: true });

              _context3.prev = 8;
              _context3.next = 11;
              return regeneratorRuntime.awrap(_reactNativeAudio.AudioRecorder.startRecording());

            case 11:
              filePath = _context3.sent;
              _context3.next = 17;
              break;

            case 14:
              _context3.prev = 14;
              _context3.t0 = _context3['catch'](8);

              console.error(_context3.t0);

            case 17:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this, [[8, 14]]);
    }
  }, {
    key: '_finishRecording',
    value: function _finishRecording(didSucceed, filePath) {
      this.setState({ finished: didSucceed });
      this.showAlert();
      console.log('Finished recording of duration ' + this.state.currentTime + ' seconds at path: ' + filePath);
    }
  }, {
    key: 'onClose',
    value: function onClose(data) {
      console.log(data);
    }
  }, {
    key: 'closeAlert',
    value: function closeAlert() {
      this.dropdown.onClose();
    }
  }, {
    key: 'showAlert',
    value: function showAlert() {
      alert("hi");
      this.dropdown.alertWithType('error', 'Error #', "Voice Recorded");
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        _reactNative.View,
        { style: styles.container },
        _react2.default.createElement(
          _reactNative.View,
          { style: styles.controls },
          _react2.default.createElement(_reactNative.Image, { style: styles.image, source: require('../images/record.png') }),
          _react2.default.createElement(
            _reactNative.Text,
            { style: styles.progressText },
            this.state.currentTime,
            's'
          ),
          _react2.default.createElement(
            _reactNative.View,
            { style: styles.buttonView },
            this._buttonValue(record, function () {
              _this3._record();
            }, this.state.recording),
            this._buttonValue(stop, function () {
              _this3._stop();
            }),
            this._buttonValue(pause, function () {
              _this3._pause();
            })
          ),
          _react2.default.createElement(_reactNativeDropdownalert2.default, {
            ref: function ref(_ref) {
              return _this3.dropdown = _ref;
            },
            onClose: function onClose(data) {
              return _this3.onClose(data);
            } })
        )
      );
    }
  }]);
  return Recordings;
}(_react.Component);

exports.default = Recordings;


var styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191919"
  },
  image: {
    width: 200,
    height: 200
  },
  buttonImage: {
    width: 40,
    height: 40
  },
  controls: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  buttonView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50,
    color: "#fff"
  },
  button: {
    borderWidth: 1,
    borderColor: 'grey',
    padding: 10
  },
  disabledButtonText: {
    color: '#eee'
  },
  buttonText: {
    fontSize: 15,
    color: "#fff"
  },
  activeButtonText: {
    fontSize: 15,
    color: "#B81F00"
  }

});

_reactNative.AppRegistry.registerComponent('Recordings', function () {
  return Recordings;
});