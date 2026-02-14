---
title: "Gateway Updates"
---

# Gateway Updates

### Gateway Consolidation

Our top focus at the moment is on improving the worst-case performance of the Gateway and Aggregator:

- Improving how we store collections historically, and revising how these are returned from the API.

  - The new ordering will be “by first appearance of collection key on ledger ASC/DESC”

### Pending Transaction Rework

Currently, the Gateway stores submitted (but not yet committed) transactions in its main database. It uses the stored information to provide status tracking for submitted transactions, and to enable the Gateway to resubmit the transaction on your behalf if it encounters difficulties or the network is temporarily too busy.

Storing submitted transactions in its main database was a simple choice originally, but it puts constraints on how the service is deployed. The resubmission is also currently handled by the Data Aggregator, which should really be focused solely on ingesting ledger updates.

Therefore our first milestone looks to address this, by moving pending transaction handling to a separate service and data store. This will result in better performance, improved resilience, and open up new possibilities for Gateway deployment.

We expect this change to be "behind-the-scenes", and won't result in substantial changes to the existing API surface. 

### Future of Gateway Discovery

The Gateway is serving the needs of many different stakeholders. These create competing constraints on the design and architecture of the Gateway, to the extent where the current set-up doesn't serve any individual use case as well as it could.

To address this, we believe it is time to look at how the Gateway and Radix stack could be evolved to better meet the current and future needs of these groups. We are referring to this process by the rather grand title of the "Gateway Discovery".

This process will lead us to exploring potential new designs and architectures, including:

- Splitting the Gateway into more focused indexing services and APIs

- Storing the data in services other than PostgreSQL

- Reworking the abstractions and encapsulation of committed transactions, receipts and related information

As this process progresses, we will be sharing updates with the community, and may consider surveying the community on key areas not covered by our previous surveys.

Regardless of outcome, we will ensure any plans/directions will be sign-posted well ahead of delivery, to allow integrators time to prepare and adapt if necessary. The existing Gateway will continue to be supported in a backwards compatible manner throughout this process, at least until suitable replacements are available, and there has been ample time for integrators to adapt to those replacements. 

We're really looking forward to the opportunities this presents for building better tools to integrators.





Future milestones



Will depend on the outcome of the Discovery process.





  

  
