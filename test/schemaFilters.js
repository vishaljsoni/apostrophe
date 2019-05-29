const t = require('../test-lib/test.js');
const assert = require('assert');
// const _ = require('lodash');
// const async = require('async');

let apos;
const cats = [];
const people = [];

describe('Schema Filters', function() {

  this.timeout(t.timeout);

  after(function() {
    return t.destroy(apos);
  });

  /// ///
  // EXISTENCE
  /// ///

  it('test modules exist', async function() {
    apos = await require('../index.js')({
      root: module,
      shortName: 'test',
      argv: {
        _: []
      },
      modules: {
        'apostrophe-express': {
          session: {
            secret: 'xxx'
          },
          port: 7900
        },
        'cats': {
          extend: 'apostrophe-pieces',
          name: 'cat',
          label: 'Cat',
          alias: 'cats',
          addFields: [
            {
              type: 'select',
              name: 'flavor',
              label: 'Flavor',
              choices: [
                {
                  label: 'Grape',
                  value: 'grape'
                },
                {
                  label: 'Cherry',
                  value: 'cherry'
                },
                {
                  label: 'Mint',
                  value: 'mint'
                }
              ]
            }
          ]
        },
        'people': {
          extend: 'apostrophe-pieces',
          name: 'person',
          label: 'Person',
          addFields: [
            {
              name: '_cats',
              type: 'joinByArray',
              idsField: 'catsIds',
              label: 'Cats',
              withType: 'cat'
            },
            {
              name: '_favorite',
              type: 'joinByOne',
              idField: 'favoriteId',
              label: 'Favorite',
              withType: 'cat'
            }
          ],
          alias: 'people'
        }
      }
    });

    assert(apos.schemas);
    assert(apos.cats);
    assert(apos.people);

    let i;

    for (i = 0; (i < 11); i++) {
      cats[i] = {};
      cats[i].type = 'cat';
      cats[i].title = 'Cat ' + i;
      cats[i].i = i;
      cats[i].published = true;
      people[i] = {};
      people[i].type = 'person';
      people[i].title = 'Person ' + i;
      people[i].i = i;
      people[i].published = true;
    }
    cats[0].flavor = 'cherry';
    cats[1].flavor = 'mint';
    cats[4].flavor = 'mint';

    const req = apos.tasks.getReq();

    await purgeCats();
    await insertCats();
    await purgePeople();
    await insertPeople();

    async function purgeCats() {
      return apos.docs.db.remove({ type: 'cat' });
    }

    async function insertCats() {
      for (const cat of cats) {
        await apos.cats.insert(req, cat);
      }
    }

    function purgePeople() {
      return apos.docs.db.remove({ type: 'person' });
    }

    async function insertPeople() {
      for (const person of people) {
        // person 10 has no favorite cat
        if (person.i < 10) {
          person.favoriteId = cats[person.i]._id;
        }
        person.catsIds = [];

        let i;
        // person 10 is allergic to cats
        if (person.i < 10) {
          for (i = 0; (i < person.i); i++) {
            person.catsIds.push(cats[i]._id);
          }
        }
        await apos.people.insert(req, person);
      };
    }
  });

  // it('filter for _cats exists', function() {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   assert(cursor._cats);
  // });

  // it('filter for _cats can select people with a specified cat', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   // Four people should have cat 5 (because their i is greater than 5, see
  //   // the sample data generator above)
  //   cursor._cats(cats[5]._id);
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     assert(people.length === 4);
  //     done();
  //   });
  // });

  // it('filter for _cats can select people with any of three cats via array', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   cursor._cats([ cats[0]._id, cats[1]._id, cats[2]._id ]);
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     // Everybody except person 0 has the first cat
  //     assert(people.length === 9);
  //     done();
  //   });
  // });

  // it('_catsAnd filter can select people with all three cats', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   cursor._catsAnd([ cats[0]._id, cats[1]._id, cats[2]._id ]);
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     // Only people 3-9 have cat 2
  //     assert(people.length === 7);
  //     done();
  //   });
  // });

  // it('filter for _cats can select sad people with no cat', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   cursor._cats('none');
  //   return cursor.toArray(function(err, _people) {
  //     assert(!err);
  //     // Persons 0 and 10 have no cats
  //     assert(_people.length === 2);
  //     const ids = _.pluck(_people, '_id');
  //     assert(_.includes(ids, people[0]._id));
  //     assert(_.includes(ids, people[10]._id));
  //     done();
  //   });
  // });

  // it('when not used filter for _cats has no effect', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     assert(people.length === 11);
  //     done();
  //   });
  // });

  // it('can obtain choices for _cats', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   return cursor.toChoices('_cats', function(err, cats) {
  //     assert(!err);
  //     // Only the cats that are actually somebody's cat come up
  //     assert(cats.length === 9);
  //     assert(cats[0].value);
  //     assert(cats[0].label);
  //     assert(cats[0].slug);
  //     done();
  //   });
  // });

  // it('filter for cats exists', function() {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   assert(cursor.cats);
  // });

  // it('filter for cats can select people with a specified cat (by slug)', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   // Four people should have cat 5 (because their i is greater than 5, see
  //   // the sample data generator above)
  //   cursor.cats(cats[5].slug);
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     assert(people.length === 4);
  //     done();
  //   });
  // });

  // it('filter for cats can select people with any of three cats via array (by slug)', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   cursor.cats([ cats[0].slug, cats[1].slug, cats[2].slug ]);
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     // Everybody except person 0 has the first cat
  //     assert(people.length === 9);
  //     done();
  //   });
  // });

  // it('catsAnd filter can select people with all three cats (by slug)', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   cursor.catsAnd([ cats[0].slug, cats[1].slug, cats[2].slug ]);
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     // Only people 3-9 have cat 2
  //     assert(people.length === 7);
  //     done();
  //   });
  // });

  // it('filter for cats can select sad people with no cat (by slug)', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   cursor.cats('none');
  //   return cursor.toArray(function(err, _people) {
  //     assert(!err);
  //     // Persons 0 and 10 have no cats
  //     assert(_people.length === 2);
  //     const ids = _.pluck(_people, '_id');
  //     assert(_.includes(ids, people[0]._id));
  //     assert(_.includes(ids, people[10]._id));
  //     done();
  //   });
  // });

  // it('when not used filter for cats (by slug) has no effect', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     assert(people.length === 11);
  //     done();
  //   });
  // });

  // it('can obtain choices for cats (by slug)', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   return cursor.toChoices('cats', function(err, cats) {
  //     assert(!err);
  //     // Only the cats that are actually somebody's cat come up
  //     assert(cats.length === 9);
  //     assert(cats[0].value);
  //     assert(cats[0].label);
  //     assert(cats[0].value === 'cat-0');
  //     done();
  //   });
  // });

  // it('filter for _favorite exists', function() {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   assert(cursor._favorite);
  // });

  // it('filter for _favorite can select people with a specified favorite cat', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   // Only one person has each favorite
  //   cursor._favorite(cats[3]._id);
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     assert(people.length === 1);
  //     assert(people[0].i === 3);
  //     done();
  //   });
  // });

  // it('filter for _favorite can use array syntax', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   cursor._favorite([ cats[7]._id ]);
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     // Only person 0 prefers the first cat
  //     assert(people.length === 1);
  //     assert(people[0].i === 7);
  //     done();
  //   });
  // });

  // it('filter for _favorite can select sad people who dislike cats', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   cursor._favorite('none');
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     // Only person 10 has no favorite cat
  //     assert(people.length === 1);
  //     assert(people[0].i === 10);
  //     done();
  //   });
  // });

  // it('when not used filter for _favorite has no effect', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     assert(people.length === 11);
  //     done();
  //   });
  // });

  // it('can obtain choices for _favorite', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   return cursor.toChoices('_favorite', function(err, cats) {
  //     assert(!err);
  //     // Only the cats that are actually someone's favorite come up
  //     assert(cats.length === 10);
  //     assert(cats[0].value);
  //     assert(cats[0].label);
  //     assert(cats[0].slug);
  //     done();
  //   });
  // });

  // it('filter for favorite (by slug) exists', function() {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   assert(cursor._favorite);
  // });

  // it('filter for favorite can select people with a specified favorite cat (by slug)', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   // Only one person has each favorite
  //   cursor.favorite(cats[3].slug);
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     assert(people.length === 1);
  //     assert(people[0].i === 3);
  //     done();
  //   });
  // });

  // it('filter for favorite can select people with a specified favorite cat (by slug) plus a search without a refinalize crash', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   // Only one person has each favorite
  //   cursor.favorite(cats[3].slug);
  //   return cursor.search('person').toArray(function(err, people) {
  //     assert(!err);
  //     assert(people.length === 1);
  //     assert(people[0].i === 3);
  //     done();
  //   });
  // });

  // it('filter for favorite (by slug) can use array syntax', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   cursor.favorite([ cats[7].slug ]);
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     // Only person 0 prefers the first cat
  //     assert(people.length === 1);
  //     assert(people[0].i === 7);
  //     done();
  //   });
  // });

  // it('filter for favorite (by slug) can select sad people who dislike cats', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   cursor.favorite('none');
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     // Only person 10 has no favorite cat
  //     assert(people.length === 1);
  //     assert(people[0].i === 10);
  //     done();
  //   });
  // });

  // it('when not used filter for favorite (by slug) has no effect', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     assert(people.length === 11);
  //     done();
  //   });
  // });

  // it('can obtain choices for favorite (by slug)', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.people.find(req);
  //   return cursor.toChoices('favorite', function(err, cats) {
  //     assert(!err);
  //     // Only the cats that are actually someone's favorite come up
  //     assert(cats.length === 10);
  //     assert(cats[0].value);
  //     assert(cats[0].label);
  //     assert(cats[0].value === 'cat-0');
  //     done();
  //   });
  // });

  // it('filter for flavor exists', function() {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.cats.find(req);
  //   assert(cursor.flavor);
  // });

  // it('filter for flavor can select cats of a specified flavor', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.cats.find(req);
  //   cursor.flavor('mint');
  //   return cursor.toArray(function(err, cats) {
  //     assert(!err);
  //     assert(cats.length === 2);
  //     assert(_.find(cats, { i: 1 }));
  //     assert(_.find(cats, { i: 4 }));
  //     done();
  //   });
  // });

  // it('filter for flavor can use array syntax', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.cats.find(req);
  //   cursor.flavor([ 'mint', 'cherry' ]);
  //   return cursor.toArray(function(err, cats) {
  //     assert(!err);
  //     assert(cats.length === 3);
  //     assert(_.find(cats, { i: 0 }));
  //     assert(_.find(cats, { i: 1 }));
  //     assert(_.find(cats, { i: 4 }));
  //     done();
  //   });
  // });

  // it('when not used filter for flavor has no effect', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.cats.find(req);
  //   return cursor.toArray(function(err, people) {
  //     assert(!err);
  //     assert(cats.length === 11);
  //     done();
  //   });
  // });

  // it('can obtain choices for flavor', function(done) {
  //   const req = apos.tasks.getReq();
  //   const cursor = apos.cats.find(req);
  //   return cursor.toChoices('flavor', function(err, flavors) {
  //     assert(!err);
  //     // Only the flavors associated with at least one cat come up, in alpha order
  //     assert(flavors.length === 2);
  //     assert(flavors[0].value === 'cherry');
  //     assert(flavors[0].label === 'Cherry');
  //     assert(flavors[1].value === 'mint');
  //     assert(flavors[1].label === 'Mint');
  //     done();
  //   });
  // });
});
