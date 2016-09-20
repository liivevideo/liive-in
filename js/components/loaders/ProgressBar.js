/* @flow */
'use strict';

import React from 'react';
import { ProgressBar, Platform} from 'react-native';
import NativeBaseComponent from 'native-base/Components/Base/NativeBaseComponent';
import computeProps from 'native-base/Utils/computeProps';

export default class ProgressBarNB extends NativeBaseComponent {

    constructor(_config) {
        super()
        this.config = _config
    }
    prepareRootProps() {
        var defaultProps = {
        }
        if (Platform.OS == "android") {
            var type = {
                height: 40
            }

            defaultProps = {
                style: type
            }
        }
        return computeProps(this.props, defaultProps);
    }

    render() {
        if (Platform.OS == "ios")
            return(
                <ProgressViewIOS  progress={this.props.progress ? this.props.progress/100 : 0.5}
                                  progressTintColor={this.props.color ? this.props.color : this.props.inverse ?
                              					this.getTheme().inverseProgressColor :
                                                this.getTheme().defaultProgressColor} />
            );
        else
            return(
                <ProgressBar  {...this.prepareRootProps()} styleAttr = "Horizontal"
                                                           indeterminate = {false} progress={this.props.progress ? this.props.progress/100 : 0.5}
                                                           color={this.props.color ? this.props.color : this.props.inverse ? this.getTheme().inverseProgressColor :
                                                      this.getTheme().defaultProgressColor}  />
            );
    }

}
