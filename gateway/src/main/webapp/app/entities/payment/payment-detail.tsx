import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './payment.reducer';

export const PaymentDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const paymentEntity = useAppSelector(state => state.gateway.payment.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="paymentDetailsHeading">
          <Translate contentKey="gatewayApp.payment.detail.title">Payment</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{paymentEntity.id}</dd>
          <dt>
            <span id="paymentMethod">
              <Translate contentKey="gatewayApp.payment.paymentMethod">Payment Method</Translate>
            </span>
          </dt>
          <dd>{paymentEntity.paymentMethod}</dd>
          <dt>
            <span id="transactionId">
              <Translate contentKey="gatewayApp.payment.transactionId">Transaction Id</Translate>
            </span>
          </dt>
          <dd>{paymentEntity.transactionId}</dd>
          <dt>
            <span id="paymentStatus">
              <Translate contentKey="gatewayApp.payment.paymentStatus">Payment Status</Translate>
            </span>
          </dt>
          <dd>{paymentEntity.paymentStatus}</dd>
          <dt>
            <span id="paymentDate">
              <Translate contentKey="gatewayApp.payment.paymentDate">Payment Date</Translate>
            </span>
          </dt>
          <dd>
            {paymentEntity.paymentDate ? <TextFormat value={paymentEntity.paymentDate} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="gatewayApp.payment.order">Order</Translate>
          </dt>
          <dd>{paymentEntity.order ? paymentEntity.order.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/payment" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/payment/${paymentEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default PaymentDetail;
