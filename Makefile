# Configuration
GENERATOR = generate.js
DEFAULT_THEME = academic

# Theme Configuration per Type
SYLLABUS_THEME = academic
ASSIGNMENT_THEME = paper
PAGE_THEME = modern
ANNOUNCEMENT_THEME = brutalist
DISCUSSION_THEME = simple

# Directories
CONTENT_DIR = content
ASSIGNMENTS_DIR = $(CONTENT_DIR)/assignments
PAGES_DIR = $(CONTENT_DIR)/pages
ANNOUNCEMENTS_DIR = $(CONTENT_DIR)/announcements
SYLLABUS_DIR = $(CONTENT_DIR)/syllabus
DISCUSSIONS_DIR = $(CONTENT_DIR)/discussions

# Source Files per Type (Recursive Search)
# Using 'shell find' ensures we get files in subdirectories of these folders too
SYLLABUS_SRCS = $(shell find $(SYLLABUS_DIR) -name "*.md" 2>/dev/null)
ASSIGNMENT_SRCS = $(shell find $(ASSIGNMENTS_DIR) -name "*.md" 2>/dev/null)
PAGE_SRCS = $(shell find $(PAGES_DIR) -name "*.md" 2>/dev/null)
ANNOUNCEMENT_SRCS = $(shell find $(ANNOUNCEMENTS_DIR) -name "*.md" 2>/dev/null)
DISCUSSION_SRCS = $(shell find $(DISCUSSIONS_DIR) -name "*.md" 2>/dev/null)

# All other markdown files in content root and ANY other custom subdirectories
# 1. Find ALL markdown files in content/ recursively
# 2. Filter OUT the files that belong to the known categories above to avoid double-building
ALL_CONTENT_SRCS = $(shell find $(CONTENT_DIR) -name "*.md")
KNOWN_SRCS = $(SYLLABUS_SRCS) $(ASSIGNMENT_SRCS) $(PAGE_SRCS) $(ANNOUNCEMENT_SRCS) $(DISCUSSION_SRCS)
OTHER_SRCS = $(filter-out $(KNOWN_SRCS), $(ALL_CONTENT_SRCS))

# Output Objects
SYLLABUS_OBJS = $(SYLLABUS_SRCS:.md=_$(SYLLABUS_THEME).html)
ASSIGNMENT_OBJS = $(ASSIGNMENT_SRCS:.md=_$(ASSIGNMENT_THEME).html)
PAGE_OBJS = $(PAGE_SRCS:.md=_$(PAGE_THEME).html)
ANNOUNCEMENT_OBJS = $(ANNOUNCEMENT_SRCS:.md=_$(ANNOUNCEMENT_THEME).html)
DISCUSSION_OBJS = $(DISCUSSION_SRCS:.md=_$(DISCUSSION_THEME).html)
OTHER_OBJS = $(OTHER_SRCS:.md=_$(DEFAULT_THEME).html)

# All targets
ALL_OBJS = $(SYLLABUS_OBJS) $(ASSIGNMENT_OBJS) $(PAGE_OBJS) $(ANNOUNCEMENT_OBJS) $(DISCUSSION_OBJS) $(OTHER_OBJS)

.PHONY: all clean help

all: $(ALL_OBJS)

# Specific Rules for each type
$(SYLLABUS_DIR)/%_$(SYLLABUS_THEME).html: $(SYLLABUS_DIR)/%.md
	@echo "🔨 Building Syllabus $@..."
	@node $(GENERATOR) $< $(SYLLABUS_THEME)

$(ASSIGNMENTS_DIR)/%_$(ASSIGNMENT_THEME).html: $(ASSIGNMENTS_DIR)/%.md
	@echo "🔨 Building Assignment $@..."
	@node $(GENERATOR) $< $(ASSIGNMENT_THEME)

$(PAGES_DIR)/%_$(PAGE_THEME).html: $(PAGES_DIR)/%.md
	@echo "🔨 Building Page $@..."
	@node $(GENERATOR) $< $(PAGE_THEME)

$(ANNOUNCEMENTS_DIR)/%_$(ANNOUNCEMENT_THEME).html: $(ANNOUNCEMENTS_DIR)/%.md
	@echo "🔨 Building Announcement $@..."
	@node $(GENERATOR) $< $(ANNOUNCEMENT_THEME)

$(DISCUSSIONS_DIR)/%_$(DISCUSSION_THEME).html: $(DISCUSSIONS_DIR)/%.md
	@echo "🔨 Building Discussion $@..."
	@node $(GENERATOR) $< $(DISCUSSION_THEME)

# Fallback for ANY other content file (recursive match)
# The % pattern here matches the relative path from CONTENT_DIR
$(CONTENT_DIR)/%_$(DEFAULT_THEME).html: $(CONTENT_DIR)/%.md
	@echo "🔨 Building Content $@..."
	@node $(GENERATOR) $< $(DEFAULT_THEME)

clean:
	@echo "🧹 Cleaning up HTML files..."
	@rm -f $(ALL_OBJS)

help:
	@echo "Usage: make [all|clean]"
	@echo "Builds course content with configured themes:"
	@echo "  Syllabus:      $(SYLLABUS_THEME)"
	@echo "  Assignments:   $(ASSIGNMENT_THEME)"
	@echo "  Pages:         $(PAGE_THEME)"
	@echo "  Announcements: $(ANNOUNCEMENT_THEME)"
	@echo "  Discussions:   $(DISCUSSION_THEME)"
	@echo "  Other:         $(DEFAULT_THEME)"
