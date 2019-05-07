/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+relay
 * @format
 */

'use strict';

const GraphQLCompilerContext = require('../../core/GraphQLCompilerContext');
const GraphQLIRPrinter = require('../../core/GraphQLIRPrinter');
const RelayMaskTransform = require('../RelayMaskTransform');
const RelayRelayDirectiveTransform = require('../RelayRelayDirectiveTransform');

const {transformASTSchema} = require('../../core/ASTConvert');
const {
  TestSchema,
  generateTestsFromFixtures,
  parseGraphQLText,
} = require('relay-test-utils');

describe('RelayMaskTransform', () => {
  const schema = transformASTSchema(TestSchema, [
    RelayRelayDirectiveTransform.SCHEMA_EXTENSION,
  ]);

  generateTestsFromFixtures(
    `${__dirname}/fixtures/relay-mask-transform`,
    text => {
      const {definitions} = parseGraphQLText(schema, text);
      return new GraphQLCompilerContext(TestSchema, schema)
        .addAll(definitions)
        .applyTransforms([
          // Requires Relay directive transform first.
          RelayRelayDirectiveTransform.transform,
          RelayMaskTransform.transform,
        ])
        .documents()
        .map(doc => GraphQLIRPrinter.print(doc))
        .join('\n');
    },
  );

  generateTestsFromFixtures(
    `${__dirname}/fixtures/relay-mask-transform-variables`,
    text => {
      const {definitions} = parseGraphQLText(schema, text);
      return new GraphQLCompilerContext(TestSchema, schema)
        .addAll(definitions)
        .applyTransforms([
          // Requires Relay directive transform first.
          RelayRelayDirectiveTransform.transform,
          RelayMaskTransform.transform,
        ])
        .documents()
        .map(doc => {
          const printed = GraphQLIRPrinter.print(doc);
          const json = JSON.stringify(doc.argumentDefinitions, null, 2);
          return printed + json;
        })
        .join('\n\n');
    },
  );
});
