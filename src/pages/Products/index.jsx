import React, { useState } from 'react'
import { Box, Typography, TextField, InputAdornment, MenuItem, Select, Chip, FormControl, InputLabel } from '@mui/material'
import { Search, FilterList } from '@mui/icons-material'
import styles from './styles.module.scss'

export default function ProductsPage() {
  const [species, setSpecies] = useState('all')

  return (
    <Box>
      {/* SECONDARY NAVBAR (SEARCH & FILTERS) FULL WIDTH */}
      <Box className={styles.searchBarGlobalWrapper}>
        <Box className={styles.searchBarContainer}>
          
          {/* Search Input */}
          <TextField
            fullWidth
            placeholder="Search across all dimensions..."
            variant="outlined"
            className={styles.searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className={styles.searchIcon} />
                </InputAdornment>
              )
            }}
          />

        {/* Filters Group */}
        <Box className={styles.filtersGroup}>
          <Typography className={styles.filterLabel}>
            <FilterList fontSize="small" /> FILTER:
          </Typography>
          
          <FormControl className={styles.speciesFormControl}>
            <InputLabel id="species-label">Species</InputLabel>
            <Select
              labelId="species-label"
              value={species}
              label="Species"
              onChange={(e) => setSpecies(e.target.value)}
              IconComponent={(props) => (
                <svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              )}
            >
              <MenuItem value="all">All Species</MenuItem>
              <MenuItem value="Human">Human</MenuItem>
              <MenuItem value="Alien">Alien</MenuItem>
            </Select>
          </FormControl>

          {/* Status Pills */}
          <Box className={styles.pillsGroup}>
            <Chip 
              icon={<div className={styles.cardDot} style={{backgroundColor: 'currentColor'}} />} 
              label="In Stock" 
              className={`${styles.pill} ${styles.pillGreen}`} 
            />
            <Chip 
              icon={<div className={styles.cardDot} style={{backgroundColor: 'currentColor'}} />} 
              label="Discontinued" 
              className={`${styles.pill} ${styles.pillRed}`} 
            />
            <Chip 
              icon={<div className={styles.cardDot} style={{backgroundColor: 'currentColor'}} />} 
              label="Unknown" 
              className={`${styles.pill} ${styles.pillYellow}`} 
            />
          </Box>

          <Box className={styles.entitiesBadge}>
            20 entities
          </Box>
          </Box>
        </Box>
      </Box>

      {/* PAGE CONTENT */}
      <Box className={styles.pageContainer}>
        {/* CATALOG HEADER */}
        <Box className={styles.catalogHeader}>
        <Typography className={styles.catalogTitle}>
          Interdimensional Catalog
        </Typography>
        <Typography className={styles.catalogSub}>
          CITADEL_DB :: 20 ENTITIES FOUND
        </Typography>
      </Box>

      {/* PRODUCTS GRID (A implementar por el usuario) */}
      <Box sx={{ minHeight: '400px' }}></Box>
      </Box>

    </Box>
  )
}
