import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GDSC_DEKUT',
      version: '0.1.0',
      description: 'welcome to the well documented gdsc-dekut backend'
    },
    paths: {
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          description: 'login a user',
          requestBody: {
            required: true,
            content: {
              'application/Json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'string',
                      example: 'test@gmail.com'
                    },
                    password: {
                      type: 'string',
                      example: 'pass123'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'user logged in successfully'
            },
            404: {
              description: 'user does not exists'
            },
            500: {
              description: 'something went wrong'
            }
          }
        }
      },
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          decription: 'create a new user',
          requestBody: {
            required: true,
            content: {
              'application/Json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'GDSC DEKUT'
                    },
                    email: {
                      type: 'string',
                      example: 'gdsc@gmail.com'
                    },
                    password: {
                      type: 'string',
                      example: 'pass123'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'user registered successfully'
            },
            404: {
              description: 'user  exists'
            },
            500: {
              description: 'something went wrong'
            }
          }
        }
      },

      '/user': {
        get: {
          tags: ['user'],
          description: 'get all the users',
          responses: {
            500: {
              description: 'something went wrong'
            },
            404: {
              description: 'users not found'
            },
            200: {
              description: 'all the users'
            }
          }
        }
      },

      '/user/{id}': {
        get: {
          tags: ['user'],
          description: 'get one specific user using their id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'The user id',
              required: true,
              schema: {
                type: 'string',
                required: true,
                description: 'The user id'
              }
            }
          ],
          responses: {
            200: {
              description: 'user profile'
            },
            404: {
              description: 'user does not exist'
            },
            500: {
              description: 'something went wrong'
            }
          }
        }
      },

      '/user/update/{id}': {
        put: {
          tags: ['user'],
          description: 'update the user profile',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                required: true
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/Json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'GDSC DEKUT'
                    },
                    email: {
                      type: 'string',
                      example: 'gdsc@gmail.com'
                    },
                    twitter: {
                      type: 'string',
                      example: '_emiliokariuki'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'user profile updated successfully'
            },
            404: {
              description: 'user does not exist'
            },
            500: {
              desription: 'error updating user profile'
            }
          }
        }
      },

      '/user/password': {
        put: {
          tags: ['user', 'Authentication'],
          description: 'change login password',
          requestBody: {
            required: true,
            content: {
              'application/Json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'string',
                      example: 'gdsc@gmail.com'
                    },
                    password: {
                      type: 'string',
                      example: 'pass1234'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'user password updated successfully'
            },
            404: {
              description: 'user does not exist'
            },
            500: {
              description: 'something went wrong'
            }
          }
        }
      },

      '/user/enableAdmin/{id}': {
        put: {
          tags: ['user'],
          description: 'make a user an admin',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                description: 'user id'
              }
            }
          ],
          responses: {
            200: {
              description: 'user is now admin'
            },
            404: {
              description: 'user does not exist'
            },
            500: {
              description: 'something went wrong'
            }
          }
        }
      },

      '/user/disableAdmin/{id}': {
        put: {
          tags: ['user'],
          description: 'disable a user as admin',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                description: 'user id'
              }
            }
          ],
          responses: {
            200: {
              description: 'user is now removed as admin'
            },
            404: {
              description: 'user does not exist'
            },
            500: {
              description: 'something went wrong'
            }
          }
        }
      },

      '/user/leads': {
        get: {
          tags: ['user'],
          description: 'get all the leads',
          responses: {
            200: {
              description: 'all the leads'
            },
            404: {
              description: 'leads do not exist'
            },
            500: {
              description: 'error getting the leads'
            }
          }
        }
      },

      '/user/delete/{id}': {
        delete: {
          tags: ['user'],
          description: 'delete a user using their id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'user id',
              required: true,
              schema: {
                type: 'string',
                required: true,
                description: 'user id'
              }
            }
          ],
          responses: {
            200: {
              description: 'user deleted successfully'
            },
            404: {
              description: 'user does not exist'
            },
            500: {
              description: 'something went wrong'
            }
          }
        }
      },
      //* events
      '/event/create': {
        post: {
          tags: ['event'],
          desription: 'create an event',
          requestBody: {
            required: true,
            content: {
              'application/Json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'gdsc test event'
                    },
                    description: {
                      type: 'string',
                      example: 'this is an example of an event description'
                    },
                    venue: {
                      type: 'string',
                      example: 'event venue'
                    },
                    link: {
                      type: 'string',
                      example: 'event link'
                    },
                    image: {
                      type: 'string',
                      example: 'image link'
                    },
                    time: {
                      type: 'string',
                      example: 'event time'
                    },
                    date: {
                      type: 'string',
                      example: 'event date'
                    },
                    organizers: {
                      type: 'string',
                      example: 'event organizers'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'event created successfully'
            },
            404: {
              description: 'event does not exist'
            },
            500: {
              description: 'something went wrong'
            }
          }
        }
      },
      '/event/upcoming': {
        get: {
          tags: ['event'],
          description: 'get all the upcoming events',
          responses: {
            200: { description: 'upcoming events fetched successfully' },
            404: { description: 'upcoming events do not exist' },
            500: { description: 'error fetching the upcoming events' }
          }
        }
      },
      '/event/past': {
        get: {
          tags: ['event'],
          description: 'get all the past events',
          responses: {
            200: { description: 'past events fetched successfully' },
            404: { description: 'past events do not exist' },
            500: { description: 'error fetching the past events' }
          }
        }
      },
      '/event/{id}': {
        get: {
          tags: ['event'],
          description: 'get one event using the id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                required: true,
                description: 'event id'
              }
            }
          ],
          responses: {
            200: { description: 'event fetched successfully' },
            404: { description: 'event do not exist' },
            500: { description: 'error fetching the event' }
          }
        }
      },
      '/event/search/upcoming/{query}': {
        get: {
          tags: ['event'],
          description: 'search for an upcoming event',
          parameters: [
            {
              name: 'query',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                required: true,
                description: 'the search queries for the events'
              }
            }
          ],
          responses: {
            200: { description: 'events searched successfully' },
            404: { description: 'events do not exist' },
            500: { description: 'error searching  the upcoming events' }
          }
        }
      },
      '/event/search/past/{query}': {
        get: {
          tags: ['event'],
          description: 'search for a past event',
          parameters: [
            {
              name: 'query',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                required: true,
                description: 'the search queries for the events'
              }
            }
          ],
          responses: {
            200: { description: 'events searched successfully' },
            404: { description: 'events do not exist' },
            500: { description: 'error searching  the upcoming events' }
          }
        }
      },
      '/event/update/{id}': {
        put: {
          tags: ['event'],
          description: 'update a particular event',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                required: true,
                desription: 'event id'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/Json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'gdsc test event'
                    },
                    description: {
                      type: 'string',
                      example: 'this is an example of an event description'
                    },
                    venue: {
                      type: 'string',
                      example: 'event venue'
                    },
                    link: {
                      type: 'string',
                      example: 'event link'
                    },
                    image: {
                      type: 'string',
                      example: 'image link'
                    },
                    time: {
                      type: 'string',
                      example: 'event time'
                    },
                    date: {
                      type: 'string',
                      example: 'event date'
                    },
                    organizers: {
                      type: 'string',
                      example: 'event organizers'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'event upddate successfully' },
            404: { description: 'event do not exist' },
            500: { description: 'error updating  the  event' }
          }
        }
      },
      '/event/complete/{id}': {
        put: {
          tags: ['event'],
          description: 'this is to mark an event as complete',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                required: true,
                desription: 'event id'
              }
            }
          ],
          responses: {
            200: { description: 'event completed successfully' },
            404: { description: 'event do not exist' },
            500: { description: 'error completing  the  event' }
          }
        }
      },
      '/event/start/{id}': {
        put: {
          tags: ['event'],
          description: 'this is to start any completed event',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                required: true,
                desription: 'event id'
              }
            }
          ],
          responses: {
            200: { description: 'event started successfully' },
            404: { description: 'event do not exist' },
            500: { description: 'error starting  the  event' }
          }
        }
      },
      '/event/remove/{id}': {
        put: {
          tags: ['event'],
          description: 'this is to delete any completed event',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                required: true,
                desription: 'event id'
              }
            }
          ],
          responses: {
            200: { description: 'event deleted successfully' },
            404: { description: 'event do not exist' },
            500: { description: 'error deleting  the  event' }
          }
        }
      },
      '/group/create': {
        post: {
          tags: ['group'],
          description: 'create a new group for the application',
          requestBody: {
            required: true,
            content: {
              'application/Json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'group name'
                    },
                    link: {
                      type: 'string',
                      example: 'group invitation link'
                    },
                    image: {
                      type: 'string',
                      example: 'group image'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'group created  successfully' },
            404: { description: 'group do not exist' },
            500: { description: 'error creating  the  group' }
          }
        }
      },
      '/group': {
        get: {
          tags: ['group'],
          description: 'get all the groups',
          responses: {
            200: { description: 'groups fetched successfully' },
            404: { description: 'groups do not exist' },
            500: { description: 'error fetching  the  groups' }
          }
        }
      },
      '/group/{id}': {
        get: {
          tags: ['group'],
          description: 'get a group using the group id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                required: true,
                description: 'group id'
              }
            }
          ],
          responses: {
            200: { description: 'group fetched successfully' },
            404: { description: 'group does not exist' },
            500: { description: 'error fetching  the  group' }
          }
        }
      },
      '/group/update/{id}': {
        put: {
          tags: ['group'],
          description: 'update the details for the groups',
          requestBody: {
            required: true,
            content: {
              'application/Json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'group name'
                    },
                    link: {
                      type: 'string',
                      example: 'group invitation link'
                    },
                    image: {
                      type: 'string',
                      example: 'group image'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'group updated  successfully' },
            404: { description: 'group do not exist' },
            500: { description: 'error updating  the  group' }
          }
        }
      },
      '/group/delete/{id}': {
        delete: {
          tags: ['group'],
          description: 'delete a group using the group id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                required: true,
                description: 'group id'
              }
            }
          ],
          responses: {
            200: { description: 'group deleted successfully' },
            404: { description: 'group do not exist' },
            500: { description: 'error deleting the  group' }
          }
        }
      },
      '/resource/approved': {
        get: {
          tags: ['resource'],
          description: 'get all the approved resources',
          responses: {
            200: { description: 'resources fetched successfully' },
            404: { description: 'resources do not exist' },
            500: { description: 'error fetching the resources' }
          }
        }
      },
      '/resource/unapproved': {
        get: {
          tags: ['resource'],
          description: 'get all the approved resources',
          responses: {
            200: { description: 'resources fetched successfully' },
            404: { description: 'resources do not exist' },
            500: { description: 'error fetching the resources' }
          }
        }
      },
      '/resource/create': {
        post: {
          tags: ['resource'],
          desription: 'create a new resource',
          requestBody: {
            required: true,
            content: {
              'application/Json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'resource name'
                    },
                    link: {
                      type: 'string',
                      example: 'resource link'
                    },
                    image: {
                      type: 'string',
                      example: 'resource image'
                    },
                    category: {
                      type: 'string',
                      example: 'resouce category'
                    },
                    userId: {
                      type: 'string',
                      example: 'user id posting the resource'
                    },
                    isApproved: {
                      type: 'boolean',
                      example: 'false'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'resources created successfully' },
            404: { description: 'resources do not exist' },
            500: { description: 'error creating the resources' }
          }
        }
      },
      '/resource/{id}': {
        get: {
          tags: ['resource'],
          description: 'get a specific resource using the resource id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                description: 'resource id',
                required: true
              }
            }
          ],
          responses: {
            200: { description: 'resource fetched successfully' },
            404: { description: 'resource does not exist' },
            500: { description: 'error fetching the resource' }
          }
        }
      },
      '/resource/update/{id}': {
        put: {
          tags: ['resource'],
          description: 'update a resource using its id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                description: 'resource id',
                required: true
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/Json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'resource name'
                    },
                    link: {
                      type: 'string',
                      example: 'resource link'
                    },
                    image: {
                      type: 'string',
                      example: 'resource image'
                    },
                    category: {
                      type: 'string',
                      example: 'resouce category'
                    },
                    userId: {
                      type: 'string',
                      example: 'user id posting the resource'
                    },
                    isApproved: {
                      type: 'boolean',
                      example: 'false'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'resources updating successfully' },
            404: { description: 'resources do not exist' },
            500: { description: 'error updating the resources' }
          }
        }
      },
      '/resource/reject/{id}': {
        put: {
          tags: ['resource'],
          description: 'reject a resource',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                description: 'resource id',
                required: true
              }
            }
          ],
          responses: {
            200: { description: 'resources rejected successfully' },
            404: { description: 'resources do not exist' },
            500: { description: 'error rejecting the resources' }
          }
        }
      },
      '/resource/approved/{id}': {
        put: {
          tags: ['resource'],
          description: 'approve a resource',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                description: 'resource id',
                required: true
              }
            }
          ],
          responses: {
            200: { description: 'resources approved successfully' },
            404: { description: 'resources do not exist' },
            500: { description: 'error approving the resources' }
          }
        }
      },
      '/resource/delete/{id}': {
        put: {
          tags: ['resource'],
          description: 'deleting a resource',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                description: 'resource id',
                required: true
              }
            }
          ],
          responses: {
            200: { description: 'resources deleted successfully' },
            404: { description: 'resources do not exist' },
            500: { description: 'error deleting the resources' }
          }
        }
      },
      '/space/create': {
        post: {
          tags: ['space'],
          description: 'create a twitter space',
          requestBody: {
            required: true,
            content: {
              'application/Json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'space title'
                    },
                    link: {
                      type: 'string',
                      example: 'space link'
                    },
                    image: {
                      type: 'string',
                      example: 'space image'
                    },
                    start: {
                      type: 'string',
                      example: 'space start time'
                    },
                    end: {
                      type: 'string',
                      example: 'space end time'
                    },
                    date: {
                      type: 'string',
                      example: 'space date'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'space created successfully' },
            404: { description: 'space do not exist' },
            500: { description: 'error creating the space' }
          }
        }
      },
      '/space': {
        get: {
          tags: ['space'],
          description: 'get all the twitter spaces',
          responses: {
            200: { description: 'spaces fetched successfully' },
            404: { description: 'spaces do not exist' },
            500: { description: 'error fetching the spaces' }
          }
        }
      },
      '/space/{id}': {
        get: {
          tags: ['space'],
          description: 'get a twitter spaces with id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                desription: 'group id',
                required: true
              }
            }
          ],
          responses: {
            200: { description: 'space fetched successfully' },
            404: { description: 'space do not exist' },
            500: { description: 'error fetching the space' }
          }
        }
      },
      '/space/update/{id}': {
        get: {
          tags: ['space'],
          description: 'update a twitter spaces with id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                desription: 'group id',
                required: true
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/Json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'space title'
                    },
                    link: {
                      type: 'string',
                      example: 'space link'
                    },
                    image: {
                      type: 'string',
                      example: 'space image'
                    },
                    start: {
                      type: 'string',
                      example: 'space start time'
                    },
                    end: {
                      type: 'string',
                      example: 'space end time'
                    },
                    date: {
                      type: 'string',
                      example: 'space date'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'space updated successfully' },
            404: { description: 'space do not exist' },
            500: { description: 'error updating the space' }
          }
        }
      },
      '/space/delete/{id}': {
        get: {
          tags: ['space'],
          description: 'delete a twitter spaces with id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                desription: 'group id',
                required: true
              }
            }
          ],

          responses: {
            200: { description: 'space deleted successfully' },
            404: { description: 'space do not exist' },
            500: { description: 'error deleting the space' }
          }
        }
      },
      '/notification': {
        post: {
          tags: ['notification'],
          description: 'create a notification for updates',
          requestBody: {
            required: true,
            content: {
              'application/Json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'notification title'
                    },
                    content: {
                      type: 'string',
                      example: 'space content'
                    },
                    image: {
                      type: 'string',
                      example: 'notificaiton image'
                    },
                    topic: {
                        type: 'string',
                        example: 'notificaiton topic'
                      }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'notification posted successfully' },
            404: { description: 'notification do not exist' },
            500: { description: 'error posting the notification' }
          }
        }
      },
      
      '/feedback/create/': {
        post: {
          tags: ['feedback'],
          description: 'create a new feedback',
          requestBody: {
            required: true,
            content: {
              'application/Json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'user name'
                    },
                    email: {
                      type: 'string',
                      example: 'user email'
                    },
                    token: {
                      type: 'string',
                      example: 'user firebase token'
                    },
                    content: {
                      type: 'string',
                      example: 'space content'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'feedback posted successfully' },
            404: { description: 'feedback do not exist' },
            500: { description: 'error posting the feedback' }
          }
        }
      },
      '/feedback': {
        get: {
          tags: ['feedback'],
          description: 'get all feedbacks',
          responses: {
            200: { description: 'feedbacks fetched successfully' },
            404: { description: 'feedback do not exist' },
            500: { description: 'error fetching the feedbacks' }
          }
        }
      },
      '/feedback/update/{id}': {
        put: {
          tags: ['feedback'],
          description: 'update feedback with id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                required: true,
                desription: 'feedback id'
              }
            }
          ],
          responses: {
            200: { description: 'feedback updated successfully' },
            404: { description: 'feedback do not exist' },
            500: { description: 'error updating the feedback' }
          }
        }
      },
      '/feedback/delete/{id}': {
        put: {
          tags: ['feedback'],
          description: 'delete feedback with id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                required: true,
                desription: 'feedback id'
              }
            }
          ],
          responses: {
            200: { description: 'feedback deleted successfully' },
            404: { description: 'feedback do not exist' },
            500: { description: 'error deleting the feedback' }
          }
        }
      },
      '/report/create/': {
        post: {
          tags: ['report'],
          description: 'create a new report',
          requestBody: {
            required: true,
            content: {
              'application/Json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'user name'
                    },
                    email: {
                      type: 'string',
                      example: 'user email'
                    },
                    token: {
                      type: 'string',
                      example: 'user firebase token'
                    },
                    content: {
                      type: 'string',
                      example: 'space content'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'report posted successfully' },
            404: { description: 'report do not exist' },
            500: { description: 'error posting the report' }
          }
        }
      },
      '/report': {
        get: {
          tags: ['report'],
          description: 'get all reports',
          responses: {
            200: { description: 'reports fetched successfully' },
            404: { description: 'report do not exist' },
            500: { description: 'error fetching the reports' }
          }
        }
      },
      '/report/update/{id}': {
        put: {
          tags: ['report'],
          description: 'update report with id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                required: true,
                desription: 'report id'
              }
            }
          ],
          responses: {
            200: { description: 'report updated successfully' },
            404: { description: 'report do not exist' },
            500: { description: 'error updating the report' }
          }
        }
      },
      '/report/delete/{id}': {
        put: {
          tags: ['report'],
          description: 'delete report with id',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                required: true,
                desription: 'report id'
              }
            }
          ],
          responses: {
            200: { description: 'report deleted successfully' },
            404: { description: 'report do not exist' },
            500: { description: 'error deleting the report' }
          }
        }
      }
    }
  },
  apis: ['./src/**/*.ts']
};

export const swagger = swaggerJsdoc(options);
