import React from 'react';
import { Col, Pagination, Row } from 'react-bootstrap';

import SystemMessagesStore from 'stores/systemmessages/SystemMessagesStore';

import { Spinner } from 'components/common';
import { SystemMessagesList } from 'components/systemmessages';

const SystemMessagesComponent = React.createClass({
  getInitialState() {
    return {currentPage: 1};
  },
  componentDidMount() {
    this.loadMessages(this.state.currentPage);
    setInterval(() => { this.loadMessages(this.state.currentPage); }, 1000);
  },
  PER_PAGE: 30,
  loadMessages(page) {
    SystemMessagesStore.all(page).then((response) => {
      this.setState(response);
    });
  },
  _onSelected(event, selectedEvent) {
    const page = selectedEvent.eventKey;

    this.setState({currentPage: page});
    this.loadMessages(page);
  },
  render() {
    if (!this.state.total) {
      return <Spinner />;
    }

    const numberPages = Math.ceil(this.state.total / this.PER_PAGE);
    const paginatorSize = 10;

    return (
      <Row className="content">
        <Col md={12}>
          <h2><i className="fa fa-comments-o"/> System Messages</h2>

          <p className="description">
            System messages are generated by graylog-server nodes on certain events that may be interesting for
            the Graylog administrators. You don't need to actively act upon any message in here because notifications
            will be raised for any events that required action.
          </p>

          <SystemMessagesList messages={this.state.messages}/>


          <Pagination bsSize="small" items={numberPages}
                      activePage={this.state.currentPage}
                      onSelect={this._onSelected}
                      prev next first last
                      maxButtons={Math.min(paginatorSize, numberPages)}/>
        </Col>
      </Row>
    );
  },
});

export default SystemMessagesComponent;
