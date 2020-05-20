import React, { Component } from "react";
import { View } from "react-native";
import { StickyManager } from "./StickyManager";
import { Zindex, Context } from "./Context";

export default class StickyContainer extends Component {
  constructor(props) {
    super(props);
    this.zIndex = Zindex.number--;
    this.firstLoad = true;
    this.key = `StickyContainer-${Math.random()}`;
    this.height = 0;
    this._onLayout = this._onLayout.bind(this);
    this.externalStickyManager = new StickyManager();
  }

  render() {
    const { children, external } = this.props;
    return (
      <Context.Consumer>
        {(context) => {
          const { stickyScrollY, stickyManager, flatList } = context;
          this.stickyManager = stickyManager;
          return (
            <Context.Provider
              value={{
                stickyScrollY,
                stickyManager: external
                  ? this.externalStickyManager
                  : stickyManager,
                flatList,
                stickyContainerKey: this.key,
              }}
            >
              <View onLayout={this._onLayout} style={{ zIndex: this.zIndex }}>
                {children}
              </View>
            </Context.Provider>
          );
        }}
      </Context.Consumer>
    );
  }

  _onLayout(event) {
    if (
      !this.firstLoad &&
      Math.abs(this.height - event.nativeEvent.layout.height) > 5
    ) {
      this.stickyManager.measureLayoutAll(this.key);
    }
    this.height = event.nativeEvent.layout.height;
    this.firstLoad = false;
  }
}
