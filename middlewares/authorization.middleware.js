const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * verificar se o utilizador tem permissão para aceder a um recurso específico
 * vrifica se o recurso pertence ao utilizador autenticado
 */
function authorizeResource(resourceType) {
    return async (req, res, next) => {
        try {
            const userId = req.user.userId || req.user.id;
            
            if (!userId) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'User ID not found in token'
                });
            }

            let resourceId;
            
            switch (resourceType) {
                case 'goal':
                    resourceId = req.params.id || req.body.userId;
                    break;
                case 'mission':
                    resourceId = req.params.id || req.body.fk_id_mission;
                    break;
                case 'user':
                    resourceId = req.params.id || req.params.userId;
                    break;
                case 'specialMission':
                    resourceId = req.params.userMissionId || req.params.userId;
                    break;
                default:
                    resourceId = req.params.id;
            }

            if (!resourceId) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Resource ID is required'
                });
            }

            // Verificar se o recurso pertence ao utilizador
            let resource;
            switch (resourceType) {
                case 'goal':
                    resource = await prisma.goal.findFirst({
                        where: {
                            id: parseInt(resourceId),
                            fk_id_user: parseInt(userId)
                        }
                    });
                    break;
                    
                case 'mission':
                    resource = await prisma.mission.findFirst({
                        where: {
                            id: parseInt(resourceId),
                            goal: {
                                fk_id_user: parseInt(userId)
                            }
                        },
                        include: {
                            goal: true
                        }
                    });
                    break;
                    
                case 'user':
                    if (parseInt(resourceId) !== parseInt(userId)) {
                        return res.status(403).json({
                            status: 'fail',
                            message: 'Access denied: You can only access your own data'
                        });
                    }
                    resource = { id: resourceId }; // Simular recurso encontrado
                    break;
                    
                case 'specialMission':
                    resource = await prisma.userSpecialMission.findFirst({
                        where: {
                            id: parseInt(resourceId),
                            fk_id_user: parseInt(userId)
                        }
                    });
                    break;
                    
                default:
                    return res.status(400).json({
                        status: 'fail',
                        message: 'Invalid resource type'
                    });
            }

            if (!resource) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Access denied: Resource not found or does not belong to you'
                });
            }

            // Adicionar o recurso ao request para uso posterior
            req.resource = resource;
            next();
            
        } catch (error) {
            console.error('Authorization error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error during authorization'
            });
        }
    };
}

function authorizeByQueryParam(paramName, resourceType) {
    return async (req, res, next) => {
        try {
            const userId = req.user.userId || req.user.id;
            const queryUserId = req.query[paramName];
            
            if (!userId) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'User ID not found in token'
                });
            }

            if (!queryUserId) {
                return res.status(400).json({
                    status: 'fail',
                    message: `${paramName} is required`
                });
            }

            // Verificar se o utilizador está a tentar aceder aos seus próprios dados
            if (parseInt(queryUserId) !== parseInt(userId)) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'Access denied: You can only access your own data'
                });
            }

            next();
            
        } catch (error) {
            console.error('Authorization error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error during authorization'
            });
        }
    };
}

function authorizeCreation(resourceType) {
    return async (req, res, next) => {
        try {
            const userId = req.user.userId || req.user.id;
            
            if (!userId) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'User ID not found in token'
                });
            }

            switch (resourceType) {
                case 'mission': {
                    const goalId = req.body.fk_id_goal;
                    if (!goalId) {
                        return res.status(400).json({
                            status: 'fail',
                            message: 'Goal ID is required to create a mission'
                        });
                    }

                    const goal = await prisma.goal.findFirst({
                        where: {
                            id: parseInt(goalId),
                            fk_id_user: parseInt(userId)
                        }
                    });

                    if (!goal) {
                        return res.status(403).json({
                            status: 'fail',
                            message: 'Access denied: You can only create missions for your own goals'
                        });
                    }
                    break;
                }

                case 'goal': {
                    // Verificar se o utilizador está a criar um goal para si próprio
                    const goalUserId = req.body.userId;
                    if (goalUserId && parseInt(goalUserId) !== parseInt(userId)) {
                        return res.status(403).json({
                            status: 'fail',
                            message: 'Access denied: You can only create goals for yourself'
                        });
                    }
                    break;
                }

                case 'specialMission': {
                    const missionUserId = req.body.userId;
                    if (missionUserId && parseInt(missionUserId) !== parseInt(userId)) {
                        return res.status(403).json({
                            status: 'fail',
                            message: 'Access denied: You can only assign special missions to yourself'
                        });
                    }
                    break;
                }

                default:
                    return res.status(400).json({
                        status: 'fail',
                        message: 'Invalid resource type for creation authorization'
                    });
            }

            next();
            
        } catch (error) {
            console.error('Creation authorization error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error during creation authorization'
            });
        }
    };
}

module.exports = {
    authorizeResource,
    authorizeByQueryParam,
    authorizeCreation
}; 