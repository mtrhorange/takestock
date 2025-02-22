import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './user-activity.reducer';

export const UserActivityDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const userActivityEntity = useAppSelector(state => state.gateway.userActivity.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="userActivityDetailsHeading">
          <Translate contentKey="gatewayApp.userActivity.detail.title">UserActivity</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{userActivityEntity.id}</dd>
          <dt>
            <span id="userId">
              <Translate contentKey="gatewayApp.userActivity.userId">User Id</Translate>
            </span>
          </dt>
          <dd>{userActivityEntity.userId}</dd>
          <dt>
            <span id="productId">
              <Translate contentKey="gatewayApp.userActivity.productId">Product Id</Translate>
            </span>
          </dt>
          <dd>{userActivityEntity.productId}</dd>
          <dt>
            <span id="action">
              <Translate contentKey="gatewayApp.userActivity.action">Action</Translate>
            </span>
          </dt>
          <dd>{userActivityEntity.action}</dd>
          <dt>
            <span id="timestamp">
              <Translate contentKey="gatewayApp.userActivity.timestamp">Timestamp</Translate>
            </span>
          </dt>
          <dd>
            {userActivityEntity.timestamp ? <TextFormat value={userActivityEntity.timestamp} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
        </dl>
        <Button tag={Link} to="/user-activity" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/user-activity/${userActivityEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default UserActivityDetail;
