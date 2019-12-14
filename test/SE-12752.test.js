import { fixture, assert, html } from '@open-wc/testing';
import { AmfLoader } from './amf-loader.js';
import '@api-components/raml-aware/raml-aware.js';
import '../api-url-data-model.js';

describe('SE-12752', function() {
  async function basicFixture(amf, selected) {
    return (await fixture(html`<api-url-data-model
      .amf="${amf}"
      .selected="${selected}"
    ></api-url-data-model>`));
  }

  const apiFile = 'SE-12752';

  [
    ['full data model', false],
    ['compact data model', true]
  ].forEach(([label, compact]) => {
    describe(label, () => {
      let amf;

      before(async () => {
        amf = await AmfLoader.load(compact, apiFile);
      });

      it('computes query model for NodeShape', async () => {
        const method = AmfLoader.lookupOperation(amf, '/test', 'get');
        const methodId = method['@id'];
        const element = await basicFixture(amf, methodId);
        const result = element.queryModel;
        assert.typeOf(result, 'array', 'queryModel is an array');
        assert.lengthOf(result, 2, 'queryModel has 2 elements');
      });

      it('computes query model for ScalarShape', async () => {
        const method = AmfLoader.lookupOperation(amf, '/scalar', 'get');
        const methodId = method['@id'];
        const element = await basicFixture(amf, methodId);
        const result = element.queryModel;
        assert.typeOf(result, 'array', 'queryModel is an array');
        assert.lengthOf(result, 1, 'queryModel has 1 element');
      });

      // TODO: add support for ArrayShape and UnionShape.
      // This is quite complex as:
      // - should complex shapes be considered in the array shape? What
      // sense does it have with query parameters?
      // - how to process unions? This probably should be set as a property
      // of the element to generate model for a specific union type.
    });
  });
});
