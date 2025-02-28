import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './order.reducer';

export const OrderDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const orderEntity = useAppSelector(state => state.gateway.order.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="orderDetailsHeading">
          <Translate contentKey="gatewayApp.order.detail.title">Order</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{orderEntity.id}</dd>
          <dt>
            <span id="userId1">
              <Translate contentKey="gatewayApp.order.userId1">User ID</Translate>
            </span>
          </dt>
          <dd>{orderEntity.userId1}</dd>
          <dt>
            <span id="totalPrice">
              <Translate contentKey="gatewayApp.order.totalPrice">Total Price</Translate>
            </span>
          </dt>
          <dd>{orderEntity.totalPrice}</dd>
          <dt>
            <span id="orderStatus">
              <Translate contentKey="gatewayApp.order.orderStatus">Order Status</Translate>
            </span>
          </dt>
          <dd>{orderEntity.orderStatus}</dd>
          <dt>
            <span id="paymentStatus">
              <Translate contentKey="gatewayApp.order.paymentStatus">Payment Status</Translate>
            </span>
          </dt>
          <dd>{orderEntity.paymentStatus}</dd>
          <dt>
            <span id="createdDate">
              <Translate contentKey="gatewayApp.order.createdDate">Created Date</Translate>
            </span>
          </dt>
          <dd>{orderEntity.createdDate ? <TextFormat value={orderEntity.createdDate} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
        </dl>
        <Button tag={Link} to="/order" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/order/${orderEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default OrderDetail;
