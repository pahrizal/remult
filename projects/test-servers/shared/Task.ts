import { Remult, ProgressListener } from '../../core'
import { isBackend } from '../../core'
import { remult } from '../../core/src/remult-proxy'
import { Entity, Fields } from '../../core'
import { BackendMethod } from '../../core/src/server-action'
import { Validators } from '../../core/src/validators'

@Entity('tasks', {
  allowApiCrud: true,
})
export class Task {
  @Fields.uuid()
  id!: string

  @Fields.string((options, remult) => {
    options.validate = (r, c) => {
      if (!remult.dataProvider.isProxy) Validators.required(r, c)
    }
  })
  title = ''

  @Fields.boolean()
  completed = false
  @BackendMethod({ allowed: false })
  static testForbidden() {}
  @BackendMethod({ allowed: true })
  static async testStaticRemult() {
    return await remult.repo(Task).count()
  }
  @BackendMethod({ allowed: true, paramTypes: [Remult] })
  static async testInjectedRemult(remult?: Remult) {
    return await remult!.repo(Task).count()
  }
  @BackendMethod({ allowed: true, queue: true, paramTypes: [ProgressListener] })
  static async testQueuedJob(progress?: ProgressListener) {
    for (let i = 0; i < 3; i++) {
      await new Promise((res) => setTimeout(res, 100))
      progress.progress(i / 3)
    }
  }
}
@Entity('test_compound_id', {
  allowApiCrud: true,
  id: { a: true, b: true, c: true },
})
export class test_compound_id {
  @Fields.string()
  a = ''
  @Fields.string()
  b = ''
  @Fields.string()
  c = ''
  @Fields.string()
  d = ''
}
