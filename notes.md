April 2

- ML API
    - fetch all clusters existing currently
    - predict users groups as they interact

- 2 models
    - new user prediction prediction
    - 

- what data points can we collect initially?
    - desktop vs mobile
    - time of day
    - location (extrapolated to weather conditions, eg)
    - 

- engagements endpoint

- data 
    - timestamp
    - variant
    - engagement 
        - type
    - user group identifier
    - 

- myplanet site - how can we "optimize" it?
    - access to analytics
    - use case for smart component


notes
- redis pubsub for subscriptions
- subscribe to a single instance ID for changes
    - pass entire array of connected ID's to the pubsub
    - use the filter method to check for the existance of subscribed instance
    - if found, fetch it from the database, and return it in the payload.