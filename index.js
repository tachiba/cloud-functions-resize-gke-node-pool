/* SEE: https://cloud.google.com/scheduler/docs/start-and-stop-compute-engine-instances-on-a-schedule */

const Buffer = require("safe-buffer").Buffer;
const container = require("@google-cloud/container");
const client = new container.v1.ClusterManagerClient();

/* SEE: https://cloud.google.com/functions/docs/bestpractices/retries#functions-tips-infinite-retries-node8 */
const eventMaxAge = 60 * 1000;

exports.resizeGKENodePool = async (data, context) => {
  const payload = JSON.parse(Buffer.from(data.data, "base64").toString());

  const eventAge = Date.now() - Date.parse(context.timestamp);
  if (eventAge > eventMaxAge) {
    console.log(`Dropping event ${context.eventId} with age ${eventAge} ms.`);
    return;
  }

  const request = {
    projectId:  process.env.GCLOUD_PROJECT,
    zone:       payload.zone,
    clusterId:  payload.cluster_id,
    nodePoolId: payload.node_pool_id,
    nodeCount:  payload.node_count,
  };

  const result = await client.setNodePoolSize(request);
  const operation = result[0];

  console.log(operation);
};
