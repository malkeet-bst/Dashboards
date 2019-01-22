import React from "react";

class ButtonBar extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
    }
  }

  render() {
    let { nextString } = this.props
    if (nextString === undefined) {
      nextString = 'Next'
    }
    return (
      <div className="nav-btn col-sm-12">
        <button
          type="button"
          onClick={this.props.backClick}
          className="btn btn-success btn-md"
        >
          <span> Back</span>
        </button>
        <button
          type="button"
          onClick={this.props.saveClick}
          className="btn btn-primary btn-md"
        >
          <span> Save as Draft</span>
        </button>
        <button
          type="button"
          onClick={this.props.nextClick}
          className="btn btn-success btn-md"
        >
          <span>{nextString}</span>
        </button>
      </div>
    );
  }
}

export default ButtonBar;
