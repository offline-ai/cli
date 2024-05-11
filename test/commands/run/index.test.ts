import {expect, test} from '@oclif/test'

describe('run', () => {
  test
  .stdout()
  .command(['run', 'friend', '--from=oclif'])
  .it('runs script cmd', ctx => {
    expect(ctx.stdout).to.contain('hello friend from oclif!')
  })
})
