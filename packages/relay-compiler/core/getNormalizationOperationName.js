/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

'use strict';

function getNormalizationOperationName(name: string): string {
  return `${name}$normalization`;
}

module.exports = getNormalizationOperationName;
