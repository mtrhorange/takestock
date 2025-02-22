import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './product.reducer';

export const ProductDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const productEntity = useAppSelector(state => state.gateway.product.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="productDetailsHeading">
          <Translate contentKey="gatewayApp.product.detail.title">Product</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{productEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="gatewayApp.product.name">Name</Translate>
            </span>
          </dt>
          <dd>{productEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="gatewayApp.product.description">Description</Translate>
            </span>
          </dt>
          <dd>{productEntity.description}</dd>
          <dt>
            <span id="price">
              <Translate contentKey="gatewayApp.product.price">Price</Translate>
            </span>
          </dt>
          <dd>{productEntity.price}</dd>
          <dt>
            <span id="category">
              <Translate contentKey="gatewayApp.product.category">Category</Translate>
            </span>
          </dt>
          <dd>{productEntity.category}</dd>
          <dt>
            <span id="brand">
              <Translate contentKey="gatewayApp.product.brand">Brand</Translate>
            </span>
          </dt>
          <dd>{productEntity.brand}</dd>
          <dt>
            <span id="stock">
              <Translate contentKey="gatewayApp.product.stock">Stock</Translate>
            </span>
          </dt>
          <dd>{productEntity.stock}</dd>
          <dt>
            <span id="imageUrl">
              <Translate contentKey="gatewayApp.product.imageUrl">Image Url</Translate>
            </span>
          </dt>
          <dd>{productEntity.imageUrl}</dd>
          <dt>
            <span id="tags">
              <Translate contentKey="gatewayApp.product.tags">Tags</Translate>
            </span>
          </dt>
          <dd>{productEntity.tags}</dd>
        </dl>
        <Button tag={Link} to="/product" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/product/${productEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ProductDetail;
