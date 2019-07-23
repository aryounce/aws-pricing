export enum RDSStorage {
    Aurora,
    GP2,
    PIOPS,
    Magnetic
}

export function _rds_storage_type_str_to_type(type: string): RDSStorage {
    switch (type.toLowerCase()) {
        case 'aurora': {
            return RDSStorage.Aurora
        }
        case 'gp2': {
            return RDSStorage.GP2
        }
        case 'piops': {
            return RDSStorage.PIOPS
        }
        case 'magnetic': {
            return RDSStorage.Magnetic
        }
        default: {
            return null
        }
    }
}