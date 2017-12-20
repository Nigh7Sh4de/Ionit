import React, { Component } from 'react'

import {
  VirtualizedList,
} from 'react-native'

export default class InfiniteList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      x: 0,
      y: 0,
      top_reached_timeout: Date.now(),
      end_reached_timeout: Date.now(),
      top_reached: false,
      end_reached: false,
      threshold_locked: false
    }
  }

  componentWillReceiveProps(newProps) {
    const now = Date.now()
    // this.list_ref.setNativeProps({ scrollEnabled: true })
    if (newProps.data.length === this.props.data.length) {
      this.setState({
        top_reached_timeout: this.state.top_reached ? now + newProps.thresholdTimeout : now,
        end_reached_timeout: this.state.end_reached ? now + newProps.thresholdTimeout : now
      })
    }
    else {
      const new_count = newProps.data.length - this.props.data.length
      const new_length = new_count * this.props.itemLength
      this.setState({
        top_reached_timeout: now,
        end_reached_timeout: now,
        threshold_locked: true
      }, ()=>console.log('threshold locked'))
      setTimeout(()=>this.maintainOffset(new_length))
    }
  }

  maintainOffset(buffer) {
    // debugger
    const offset = this.list_ref._scrollMetrics.offset + buffer
    console.log('move to', Date.now() % 30000, offset, this.list_ref._scrollMetrics.offset)
    this.list_ref.scrollToOffset({ animated: false, offset })
    this.setState({
      threshold_locked: false
    //   top_reached: false,
    //   end_reached: false,
    }, ()=>console.log('threshold unlocked'))
  }

  scrollToItem(search) {
    let index = typeof search === 'function' ? 
      this.props.data.findIndex(search) : search
    this.list_ref.scrollToIndex({ index })
  }

  onScroll(e) {
    // console.log('offset', this.list_ref._scrollMetrics.offset)
    if (!this.state.threshold_locked)
      this.maybeCallThresholdReached()
  }

  maybeCallThresholdReached() {
    const {
      contentLength,
      visibleLength,
      offset
    } = this.list_ref._scrollMetrics
    const top_threshold = this.props.onTopReachedThreshold * visibleLength
    const end_threshold = this.props.onEndReachedThreshold * visibleLength
    const top_position = offset
    const end_position = contentLength - visibleLength - offset

    let top_reached = top_position < top_threshold,
        end_reached = end_position < end_threshold

    if (top_reached || end_reached) {
      this.setState({
        top_reached,
        end_reached
      }, () => {
        // this.list_ref.setNativeProps({ scrollEnabled: false })
        const now = Date.now()
        if (top_reached && now > this.state.top_reached_timeout)
        this.props.onTopReached()
        if (end_reached && now > this.state.end_reached_timeout)
        this.props.onEndReached()
      })
    }

  }

  render() {
    // if (this.list_ref) console.log('offset', this.list_ref._scrollMetrics.offset)
    
    return (
      <VirtualizedList
        style={this.props.style}
        ref={ref => this.list_ref = ref}
        data={this.props.data}
        renderItem={this.props.renderItem}
        getItem={(data, i) => data[i]}
        getItemCount={data => data.length}
        keyExtractor={this.props.keyExtractor}
        getItemLayout={(data, index) => ({
          offset: this.props.itemLength * index,
          length: this.props.itemLength,
          index
        })}
        initialNumToRender={12}
        initialScrollIndex={Math.min(this.props.initialScrollIndex, this.props.data.length - 6)}
        onScroll={this.onScroll.bind(this)}
        />
    )
  }
}