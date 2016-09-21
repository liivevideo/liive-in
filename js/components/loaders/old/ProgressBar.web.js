/* @flow */
'use strict';

import React from 'react';
import { ProgressBar } from 'react-native';
import NativeBaseComponent from 'native-base/Components/Base/NativeBaseComponent';
import computeProps from 'native-base/Utils/computeProps';

export default class ProgressBarNB extends NativeBaseComponent {



    render() {
        if (config.OS == "ios")
            return(
                <ProgressViewIOS  progress={this.props.progress ? this.props.progress/100 : 0.5}
                                  progressTintColor={this.props.color ? this.props.color : this.props.inverse ?
                              					this.getTheme().inverseProgressColor :
                                                this.getTheme().defaultProgressColor} />
            );
        else if (config.OS == "android")
            return(
                <ProgressBar  {...this.prepareRootProps()} styleAttr = "Horizontal"
                                                           indeterminate = {false} progress={this.props.progress ? this.props.progress/100 : 0.5}
                                                           color={this.props.color ? this.props.color : this.props.inverse ? this.getTheme().inverseProgressColor :
                                                      this.getTheme().defaultProgressColor}  />
            );
        else
            return(
                <ProgressBar  progress={this.props.progress ? this.props.progress/100 : 0.5}
                                  progressTintColor={this.props.color ? this.props.color : this.props.inverse ?
                                                    this.getTheme().inverseProgressColor :
                                                    this.getTheme().defaultProgressColor} />
            );
    }

}
