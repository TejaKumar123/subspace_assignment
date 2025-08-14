import { NhostClient } from '@nhost/nhost-js'

// Create Nhost instance
const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN, // e.g. project-xxxx
  region: import.meta.env.VITE_NHOST_REGION       // e.g. eu-central-1
})

export default nhost;
