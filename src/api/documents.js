import Vue from 'vue'
import { ServerCallBuilder } from './ServerCallBuilder'
import config from '../config'

const ScopedServerCallBuilder = ServerCallBuilder.makeScope()
  .registerResource('documents')

export default {
  getUploadConfig (type, contentType) {
    return new ScopedServerCallBuilder()
      .documents()
      .sign()
      .post({
        data: {
          type,
          attributes: {
            content_type: contentType
          }
        }
      })
  },

  uploadFile (file, policy, mimeString) {
    const formData = new FormData()
    delete policy.url
    delete policy.id
    delete policy.type
    policy['x-amz-algorithm'] = policy.xAmzAlgorithm
    policy['x-amz-credential'] = policy.xAmzCredential
    policy['x-amz-date'] = policy.xAmzDate
    policy['x-amz-signature'] = policy.xAmzSignature

    delete policy.xAmzAlgorithm
    delete policy.xAmzCredential
    delete policy.xAmzDate
    delete policy.xAmzSignature

    for (const key in policy) {
      formData.append(key, policy[key])
    }
    const blob = new Blob([file], { type: mimeString })
    formData.append('file', blob)
    return Vue.http.post(config.FILE_STORAGE, formData)
  }
}
